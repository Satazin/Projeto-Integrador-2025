// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './adm-login.page.html',
  styleUrls: ['./adm-login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]

})
export class AdmLoginPage {
  email = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

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
