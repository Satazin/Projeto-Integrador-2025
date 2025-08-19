import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; // Corrigido: importar AlertController

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
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

    // Aqui você pode chamar seu serviço de recuperação de senha
    // Exemplo de feedback para o usuário:
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}