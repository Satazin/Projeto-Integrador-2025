// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'; // Importa o environment

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]

})
export class LoginPage {
  email = '';
  senha = '';
  private auth = getAuth(initializeApp(environment.firebaseConfig));

  constructor(private authService: AuthService, private router: Router) {
     onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // Verifica se o email do usuário logado é o do admin
          if (user.email === this.authService.getAdminEmail()) {
            this.router.navigate(['/pedidos-test']);
          } else {
            this.router.navigate(['/pedidos']);
          }
        }
        // Se user for null, fica na Home/Login
      });
  }

  // Realiza o login do usuário
  async fazerLogin() {
    if (!this.email || !this.senha) {
      alert('Preencha email e senha!');
      return;
    }

    try {
      const resultado = await this.authService.login(this.email, this.senha);
      console.log('Usuário autenticado:', resultado.authUser);
      console.log('Dados do Realtime Database:', resultado.realtimeData);

      this.router.navigate(['/pedidos']);
    } catch (erro: any) {
      console.error('Erro no login:', erro.message);
      alert('Falha ao logar, Credenciais inválidas');
    }
  }
}
