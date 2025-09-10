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
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]

})
export class LoginPage {
  email = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

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