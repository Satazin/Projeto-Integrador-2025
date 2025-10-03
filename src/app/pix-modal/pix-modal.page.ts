// src/app/pix-modal/pix-modal.page.ts

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController, AlertController} from '@ionic/angular';
import QRCode from 'qrcode';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-pix-modal',
  templateUrl: './pix-modal.page.html',
  styleUrls: ['./pix-modal.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class PixModalPage implements AfterViewInit {
  @Input() codigoPix!: string;
  @Input() valorTotal!: number;

  @ViewChild('qrcodeCanvas') qrcodeCanvas!: ElementRef;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngAfterViewInit() {
    this.gerarQRCode();
  }

  async gerarQRCode() {
    try {
      await QRCode.toCanvas(this.qrcodeCanvas.nativeElement, this.codigoPix, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000FF',
          light: '#FFFFFFFF'
        }
      });
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  }

    async copiarCodigo() {
    try {
      await Clipboard.write({ string: this.codigoPix });

      const toast = await this.toastCtrl.create({
        message: 'Código Pix copiado!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    } catch (err) {
      console.error('Erro ao copiar Pix:', err);
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Não foi possível copiar o código Pix.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
    voltarParaCarrinho() {
    this.modalCtrl.dismiss();
  }

  finalizarCompra() {
    this.modalCtrl.dismiss(true); 
  }
}
