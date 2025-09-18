import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
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
  public fotoUrl: string | null = null;
  public placeholderUrl: string = 'assets/img/default-profile.png';
  private selectedFile: File | null = null;
  
  private dbRT; 

  constructor(
    private auth: Auth,
    private db: Firestore,
    private authService: AuthService,   // injeta o AuthService
    private router: Router              // injeta o Router pra redirecionar
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
        this.fotoUrl = dados.fotoUrl && dados.fotoUrl.length > 0 ? dados.fotoUrl : this.placeholderUrl;
      } else {
        console.log("Documento do usuário não encontrado. Criando...");
        await this.criarDocumentoPadrao(this.auth.currentUser as User);
      }
    } catch (error) {
      console.error('Erro ao carregar o perfil do Firestore:', error);
      this.fotoUrl = this.placeholderUrl;
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

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      alert('Falha ao salvar o perfil.');
    }
  }

  // 🚀 Novo método de logout
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']); // redireciona pro login
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }
}
