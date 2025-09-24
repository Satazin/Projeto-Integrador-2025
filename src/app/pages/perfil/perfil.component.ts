import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ActionSheetController} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface Usuario {
  nomeUsuario: string;
  email: string;
  telefone: string;
  fotoUrl?: string;
  endereco: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = {
    nomeUsuario: '',
    email: '',
    telefone: '',
    fotoUrl: '',
    endereco: ''
  };

  private userId: string | null = null;
  public fotoUrl: string = 'assets/img/default-profile.png';
  public placeholderUrl: string = 'assets/img/default-profile.png';
  private selectedFile: File | null = null;
  private dbRT;

  public isUpdating: boolean = false; // Variável para controlar o status de atualização

  constructor(
    private auth: Auth,
    private db: Firestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
  ) {
    this.dbRT = getDatabase();
  }

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.userId = user.uid;
        await this.carregarPerfil();
      }
    });
  }

async selecionarImagem() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Selecionar imagem',
    buttons: [
      {
        text: '📷 Câmera',
        handler: () => {
          this.pegarImagem(CameraSource.Camera);
        }
      },
      {
        text: '🖼️ Galeria',
        handler: () => {
          this.pegarImagem(CameraSource.Photos);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        data: { action: 'cancel' }
      }
    ]
  });
  await actionSheet.present();
}

  // PEGAR IMAGEM BASE64
async pegarImagem(source: CameraSource) {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source
    });

    if (image?.base64String) {
      this.fotoUrl = `data:image/jpeg;base64,${image.base64String}`;
    }
  } catch (err) {
    console.error('Erro ao pegar imagem:', err);
    const a = await this.alertController.create({
      header: 'Erro',
      message: 'Falha ao obter imagem.',
      buttons: ['OK']
    });
    await a.present();
  }
}


  async carregarPerfil() {
    if (!this.userId) return;
    
    const nomeRef = ref(this.dbRT, 'usuarios/' + this.userId + '/nome');
    onValue(nomeRef, (snapshot) => {
      const nomeDoRealtime = snapshot.val();
      if (nomeDoRealtime) {
        this.usuario.nomeUsuario = nomeDoRealtime;
      }
    });

    const telefoneRef = ref(this.dbRT, 'usuarios/' + this.userId + '/telefone');
    onValue(telefoneRef, (snapshot) => {
      const telefoneDoRealtime = snapshot.val();
      if (telefoneDoRealtime) {
        this.usuario.telefone = telefoneDoRealtime;
      }
    });

    const enderecoRef = ref(this.dbRT, 'usuarios/' + this.userId + '/endereco');
    onValue(enderecoRef, (snapshot) => {
      const enderecoDoRealtime = snapshot.val();
      if (enderecoDoRealtime) {
        this.usuario.endereco = enderecoDoRealtime;
      }
    });

    try {
      const userDocRef = doc(this.db, 'usuarios', this.userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const dados = userDocSnap.data() as Usuario;
        this.usuario.email = dados.email || '';
        if (dados.fotoUrl && dados.fotoUrl.length > 0) {
          this.fotoUrl = dados.fotoUrl;
        }
      } else {
        console.log("Documento do usuário não encontrado. Criando...");
        await this.criarDocumentoPadrao(this.auth.currentUser as User);
      }
    } catch (error) {
      console.error('Erro ao carregar o perfil do Firestore:', error);
    }
  }

  async criarDocumentoPadrao(user: User | null) {
    if (!this.userId || !user) return;
    const userDocRef = doc(this.db, 'usuarios', this.userId);
    await setDoc(userDocRef, {
      email: user.email || '',
      telefone: '',
      fotoUrl: this.placeholderUrl
    });
    await this.carregarPerfil();
  }

  async salvarPerfil() {
    if (!this.userId) return;
    
    this.isUpdating = true; // Mostra o spinner e o texto

    try {
      const userDocRef = doc(this.db, 'usuarios', this.userId);
      const dadosParaAtualizar = {
        email: this.usuario.email || '',
        telefone: this.usuario.telefone || '',
        fotoUrl: this.fotoUrl || this.placeholderUrl
      };
      await setDoc(userDocRef, dadosParaAtualizar, { merge: true });

      const nomeRef = ref(this.dbRT, 'usuarios/' + this.userId + '/nome');
      await set(nomeRef, this.usuario.nomeUsuario || '');

      const enderecoRef = ref(this.dbRT, 'usuarios/' + this.userId + '/endereco');
      await set(enderecoRef, this.usuario.endereco || '');

      const telefoneRT = ref(this.dbRT, 'usuarios/' + this.userId + '/telefone');
      await set(telefoneRT, this.usuario.telefone || '');

      this.isUpdating = false; // Esconde o spinner e o texto em caso de sucesso

      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Informações atualizadas!',
        buttons: ['OK']
      });
      await alert.present();

    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      this.isUpdating = false; // Esconde o spinner e o texto em caso de erro
      
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Falha ao salvar o perfil. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }
}