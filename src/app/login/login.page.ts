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
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';

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

  constructor(private authService: AuthService, private router: Router, private alertController: AlertController) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        if (user.email === this.authService.getAdminEmail()) {
          this.router.navigate(['/pedidos-test']);
        } else {
          this.router.navigate(['/pedidos']);
        }
      }
    });
  }

  async fazerLogin() {
    if (!this.email || !this.senha) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos e selecione o endereço no mapa.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    try {
      const resultado = await this.authService.login(this.email, this.senha);
      console.log('Usuário autenticado:', resultado.authUser);
      console.log('Dados do Realtime Database:', resultado.realtimeData);
      this.router.navigate(['/pedidos']);
    } catch (erro: any) {

      console.error('Erro no login:', erro.message);
      const alert = await this.alertController.create({
        header: 'Erro de Login',
        message: 'Falha ao logar, Credenciais inválidas.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}