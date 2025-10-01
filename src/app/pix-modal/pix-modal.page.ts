// src/app/pix-modal/pix-modal.page.ts

import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController, AlertController} from '@ionic/angular';
import QRCode from 'qrcode';

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
  private alertController: AlertController) {}

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