// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuarioLogado: User | null = null;

  constructor(private auth: Auth, private db: Database) {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogado = user;
    });
  }

  // Método de Cadastro
  async cadastrar(email: string, password: string, nome: string, telefone: string): Promise<any> {
    try {
      // 1. Cria a conta no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados do usuário no Realtime Database usando o UID como chave
      await set(ref(this.db, 'usuarios/' + user.uid), {
        email: email,
        nome: nome,
        telefone: telefone
      });

      return {
        authUser: user,
        realtimeData: { email, nome }
      };

    } catch (erro: any) {
      console.error('Erro no cadastro:', erro.message);
      throw erro;
    }
  }

  // Método de Login
  async login(email: string, password: string): Promise<any> {
    try {
      // 1. Autentica o usuário no Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // 2. Busca os dados do Realtime Database usando o UID do usuário
      const userRef = ref(this.db, 'usuarios/' + user.uid);
      const snapshot = await get(userRef);

      return {
        authUser: user,
        realtimeData: snapshot.exists() ? snapshot.val() : null
      };

    } catch (erro: any) {
      console.error('Erro no login:', erro.message);
      throw erro;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.usuarioLogado = null;
  }

  isLogged(): boolean {
    return this.usuarioLogado !== null;
  }
}