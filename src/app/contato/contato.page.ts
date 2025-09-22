import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.page.html',
  styleUrls: ['./contato.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ContatoPage implements OnInit {
   public rating: number = 0;

 constructor(private alertController: AlertController) {}
// Nova função para definir a nota
  setRating(star: number) {
    this.rating = star;
  }
  
  async exibirAlerta() {
    const alert = await this.alertController.create({
      header: 'Pedido Enviado',
      message: 'Agradeçemos pela sua avalição!Respomderemos em breve.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
  }
}
