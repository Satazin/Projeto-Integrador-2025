// src/app/pages/cadastro/cadastro.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]

})
export class CadastroPage {
  email = '';
  senha = '';
  nome = '';
  telefone = '';

  constructor(private authService: AuthService, private router: Router) {}

  async fazerCadastro() {
    if (!this.email || !this.senha || !this.nome || !this.telefone) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const resultado = await this.authService.cadastrar(this.email, this.senha, this.nome, this.telefone);
      console.log('Usuário cadastrado:', resultado.authUser);
      console.log('Dados salvos no Realtime Database:', resultado.realtimeData);
      
      this.router.navigate(['/pedidos']);
    } catch (erro: any) {
      alert('Falha ao cadastrar. ' + erro.message);
    }
  }
}