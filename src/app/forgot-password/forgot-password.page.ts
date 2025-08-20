import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private alertController: AlertController) {}

  async recuperarSenha() {
    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Por favor, informe seu e-mail.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação no seu E-mail.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}