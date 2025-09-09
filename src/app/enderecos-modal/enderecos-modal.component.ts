import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-enderecos-modal',
  templateUrl: './enderecos-modal.component.html',
  styleUrls: ['./enderecos-modal.component.scss'],
})
export class EnderecosModalComponent {
  constructor(private modalCtrl: ModalController) {}

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: EnderecosModalComponent,
      cssClass: 'modal-enderecos-custom'
    });
    await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
