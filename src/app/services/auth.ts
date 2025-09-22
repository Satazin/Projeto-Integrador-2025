import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User, 
  onAuthStateChanged 
} from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuarioLogado: User | null = null;
  private adminEmail = 'admin@gmail.com'; // único email de admin

  constructor(private auth: Auth, private db: Database) {
    // Observa mudanças no estado de login
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogado = user;
    });
  }

  async cadastrar(email: string, password: string, nome: string, telefone: string, endereco: string): Promise<any> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    await set(ref(this.db, 'usuarios/' + user.uid), {
      email: email,
      nome: nome,
      telefone: telefone,
      endereco: endereco
    });

    return {
      authUser: user,
      realtimeData: { email, nome }
    };
  }

  async login(email: string, password: string): Promise<any> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    const userRef = ref(this.db, 'usuarios/' + user.uid);
    const snapshot = await get(userRef);

    return {
      authUser: user,
      realtimeData: snapshot.exists() ? snapshot.val() : null
    };
  }

  // logout → limpa o usuário e o token
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.usuarioLogado = null;
  }

  // retorna true se o usuário está logado
  isLogged(): boolean {
    return this.usuarioLogado !== null;
  }

  // retorna true se o usuário logado for o admin
  isAdmin(): boolean {
    return this.usuarioLogado?.email === this.adminEmail;
  }

  // pega o token atual do Firebase (útil se precisar enviar pra backend)
  async getToken(): Promise<string | null> {
    if (this.usuarioLogado) {
      return await this.usuarioLogado.getIdToken();
    }
    return null;
  }
}
