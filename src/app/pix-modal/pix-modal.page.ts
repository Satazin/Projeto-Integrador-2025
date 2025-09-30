// src/app/pix-modal/pix-modal.page.ts

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
=======
import { IonicModule, ModalController, ToastController, AlertController} from '@ionic/angular';
>>>>>>> 6951d9c414c6986f2b75d1340696027cac08d212
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
<<<<<<< HEAD
  private alertController: AlertController) {}
=======
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}
>>>>>>> 6951d9c414c6986f2b75d1340696027cac08d212

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

<<<<<<< HEAD
  async copiarCodigoPix() {
  try {
    await navigator.clipboard.writeText(this.codigoPix);
    // Alerta bonitinho
    const alert = await this.alertController.create({
      header: 'Copiado!',
      message: 'O código Pix foi copiado para a área de transferência!',
      buttons: ['OK']
    });
    await alert.present();
  } catch (err) {
    console.error('Erro ao copiar', err);
=======
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
>>>>>>> 6951d9c414c6986f2b75d1340696027cac08d212
  }
}


  // Novo método para voltar sem finalizar a compra
  voltarParaCarrinho() {
    // Fecha o modal sem retornar um valor de sucesso
    this.modalCtrl.dismiss();
  }

  // Este método finaliza a compra
  finalizarCompra() {
    // Fecha o modal e retorna um valor de sucesso
    this.modalCtrl.dismiss(true); 
  }
}