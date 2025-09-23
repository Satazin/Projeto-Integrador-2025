import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular'; // Adicione LoadingController aqui
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

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

  constructor(
    private auth: Auth,
    private db: Firestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController // Injete o LoadingController aqui
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async carregarPerfil() {
    if (!this.userId) return;
    
    // Puxa nome, telefone e endereço do Realtime Database
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

    // Puxa email e fotoUrl do Firestore
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
    
    const loading = await this.loadingController.create({
      message: 'Salvando...',
      spinner: 'circles', // 'bubbles', 'circles', 'crescent', 'dots', 'lines'
      translucent: true
    });
    await loading.present();

    try {
      // Salva no Firestore
      const userDocRef = doc(this.db, 'usuarios', this.userId);
      const dadosParaAtualizar = {
        email: this.usuario.email || '',
        telefone: this.usuario.telefone || '',
        fotoUrl: this.fotoUrl || this.placeholderUrl
      };
      await setDoc(userDocRef, dadosParaAtualizar, { merge: true });

      // Salva no Realtime Database
      const nomeRef = ref(this.dbRT, 'usuarios/' + this.userId + '/nome');
      await set(nomeRef, this.usuario.nomeUsuario || '');

      const enderecoRef = ref(this.dbRT, 'usuarios/' + this.userId + '/endereco');
      await set(enderecoRef, this.usuario.endereco || '');

      const telefoneRT = ref(this.dbRT, 'usuarios/' + this.userId + '/telefone');
      await set(telefoneRT, this.usuario.telefone || '');

      await loading.dismiss(); // Fecha o loading em caso de sucesso

      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Perfil Atualizado!',
        buttons: ['OK']
      });
      await alert.present();

    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      await loading.dismiss(); // Fecha o loading em caso de erro
      
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