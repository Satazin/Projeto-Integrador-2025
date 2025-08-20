// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { environment } from '../../environments/environment';

const app = initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(app);
  private db = getDatabase(app);
  public usuarioLogado: User | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.usuarioLogado = user;
    });
  }

  async login(email: string, password: string): Promise<any> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user: User = userCredential.user;

    const userRef = ref(this.db, 'users/' + user.uid);
    const snapshot = await get(userRef);

    return {
      authUser: user,
      realtimeData: snapshot.exists() ? snapshot.val() : null
    };
  }

  async logout() {
    await signOut(this.auth);
    this.usuarioLogado = null;
  }

  isLogged(): boolean {
    return this.usuarioLogado !== null;
  }
}
