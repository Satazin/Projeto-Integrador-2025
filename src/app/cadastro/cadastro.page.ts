import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'; // Importa o environment
import { AuthService } from '../services/auth'; // Importa o AuthService

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
  endereco = '';
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

  async fazerCadastro() {
    if (!this.email || !this.senha || !this.nome || !this.telefone || !this.endereco) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const resultado = await this.authService.cadastrar(this.email, this.senha, this.nome, this.telefone, this.endereco);
      console.log('Usuário cadastrado:', resultado.authUser);
      console.log('Dados salvos no Realtime Database:', resultado.realtimeData);
      
      this.router.navigate(['/pedidos']);
    } catch (erro: any) {
      alert('Falha ao cadastrar. ' + erro.message);
    }

  }
}