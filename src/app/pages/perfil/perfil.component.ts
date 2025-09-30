// src/app/perfil/perfil.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ActionSheetController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getDatabase, ref, get, set } from "firebase/database";
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { EnderecoTransferService } from 'src/app/services/endereco-transfer'; // IMPORTADO: O Serviço

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

  public isUpdating: boolean = false;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private enderecoTransfer: EnderecoTransferService 
  ) {
    this.dbRT = getDatabase();
  }

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.userId = user.uid; 
        await this.carregarPerfil();

        await this.lerEnderecoDoServico();
      }
    });
  }

  async selecionarEndereco() {
    this.router.navigate(['/localizacao']);
  }

  private async salvarApenasEndereco(endereco: string) {
    if (!this.userId) {
      console.error('ERRO DE SALVAMENTO: userId não está definido.');
      return;
    }
    if (!endereco) return;

    try {
      const enderecoRef = ref(this.dbRT, 'usuarios/' + this.userId + '/endereco');
      await set(enderecoRef, endereco);
      console.log(`Endereço [${endereco}] salvo com sucesso no RTDB para o usuário ${this.userId}.`); // Log de sucesso
    } catch (error) {
      console.error('ERRO FATAL ao salvar endereço no RTDB. Verifique as Regras de Segurança do seu Firebase:', error);
    }
  }

  private async lerEnderecoDoServico() {
    const novoEndereco = this.enderecoTransfer.getEndereco();
    console.log('Endereço lido do Serviço:', novoEndereco); 

    if (novoEndereco) {
      this.usuario.endereco = novoEndereco;
      this.cdRef.detectChanges(); 
      await this.salvarApenasEndereco(novoEndereco);
    }
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

  // PEGAR IMAGEM BASE64 (sem alterações)
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

    // Carregamento do Firestore (sem alterações)
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
        await this.criarDocumentoPadrao(this.auth.currentUser as User);
      }
    } catch (error) {
      console.error('Erro ao carregar o perfil do Firestore:', error);
    }

    // Carregamento do RTDB com 'get' (sem alterações)
    try {
      const nomePromise = get(ref(this.dbRT, 'usuarios/' + this.userId + '/nome'));
      const telefonePromise = get(ref(this.dbRT, 'usuarios/' + this.userId + '/telefone'));
      const enderecoPromise = get(ref(this.dbRT, 'usuarios/' + this.userId + '/endereco'));

      const [nomeSnap, telefoneSnap, enderecoSnap] = await Promise.all([nomePromise, telefonePromise, enderecoPromise]);

      if (nomeSnap.exists()) {
        this.usuario.nomeUsuario = nomeSnap.val();
      }
      if (telefoneSnap.exists()) {
        this.usuario.telefone = telefoneSnap.val();
      }
      if (enderecoSnap.exists()) {
        this.usuario.endereco = enderecoSnap.val();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do RTDB:', error);
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
  }

  async salvarPerfil(shouldNavigate: boolean = true) {
    if (!this.userId) return;

    this.isUpdating = true;

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

      this.isUpdating = false;

      if (shouldNavigate) {
        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Informações atualizadas!',
          buttons: [{
            text: 'OK',
          }]
        });
        await alert.present();
      }

    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      this.isUpdating = false;

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