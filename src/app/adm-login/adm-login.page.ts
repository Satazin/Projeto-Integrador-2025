// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'; // Importa o environment
import { AuthService } from '../services/auth'; // Importa o AuthService

@Component({
  selector: 'app-login',
  templateUrl: './adm-login.page.html',
  styleUrls: ['./adm-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]

})
export class AdmLoginPage {
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

    // 🔥 aqui você define qual usuário é o admin
    const adminEmail = 'admin@gmail.com'; // coloca o email do seu adm
    const usuario = resultado.authUser;

    if (usuario.email === adminEmail) {
      console.log('Usuário é ADMIN');
      this.router.navigate(['/pedidos-test']); // rota exclusiva do admin
    } else {
      console.log('Tentativa de login negada');
      alert('Acesso negado! Usuário não é administrador.');
      this.router.navigate(['/login-adm']); // volta pro login de admin
    }

  } catch (erro: any) {
    console.error('Erro no login:', erro.message);
    alert('Falha ao logar, credenciais inválidas');
  }
}
}
