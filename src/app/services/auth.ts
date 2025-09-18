import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdmin() {
    throw new Error('Method not implemented.');
  }
  public usuarioLogado: User | null = null;
  private adminEmail = 'admin@gmail.com';

  constructor(private auth: Auth, private db: Database) {
    // Isso é o mais importante: ele atualiza o estado do usuário.
    // Quando o usuário faz login, a variável `usuarioLogado` recebe o objeto User,
    // que é a sua "prova" de que o usuário está autenticado e o token está ativo.
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

  // Realiza o login. O Firebase já cuida de tudo, inclusive do token interno.
  async login(email: string, password: string): Promise<any> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    const userRef = ref(this.db, 'usuarios/' + user.uid);
    const snapshot = await get(userRef);

    // Retorna os dados do usuário, confirmando o sucesso da autenticação.
    return {
      authUser: user,
      realtimeData: snapshot.exists() ? snapshot.val() : null
    };
  }

  // Verifica se o usuário está logado. É a sua forma de "validar o token".
  isLogged(): boolean {
    // Se a variável `usuarioLogado` tiver um valor, o token interno está ativo.
    return this.usuarioLogado !== null;
  }

  // ... (outros métodos)
}