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
    rating: number = 0;
     mensagem: string = '';    // guarda o texto digitado

 constructor(private alertController: AlertController) {}
// Nova função para definir a nota
  setRating(star: number) {
    this.rating = star;
  }
  
  async exibirAlerta() {
    const alert = await this.alertController.create({
      header: 'Mensagem Enviada',
      message: `Agradecemos pela sua avaliação de ${this.rating} estrela(s)! Responderemos em breve.`,
      buttons: [{
        text: 'OK',
        handler: () => {
          // resetar os campos quando o usuário clicar em OK
          this.rating = 0;
          this.mensagem = '';
        }
      }]
    });


    await alert.present();
  }

  ngOnInit() {
  }
}
