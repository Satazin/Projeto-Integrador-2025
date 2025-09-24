// src/app/carrinho/carrinho.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CarrinhoService, CartItem } from '../services/carrinho.service';
import { getAuth } from 'firebase/auth';
import { Router, RouterModule } from '@angular/router';

import { PixModalPage } from '../pix-modal/pix-modal.page'; // Importa a página do modal

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class CarrinhoPage implements OnInit {
  carrinhoItens$: Observable<CartItem[]>;
  valorTotalCarrinho$: Observable<number>;
  public formaPagamento: string = '';
  public compraFinalizada: boolean = false;

  constructor(
    private carrinhoService: CarrinhoService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController, // Adiciona o ModalController
    private router: Router
  ) {
    this.carrinhoItens$ = this.carrinhoService.cartItems$;

    this.valorTotalCarrinho$ = this.carrinhoItens$.pipe(
      map(itens =>
        itens.reduce((total, item) => total + item.preco * item.quantidade, 0)
      )
    );
  }

  ngOnInit() {
    this.carrinhoItens$.subscribe(itens => {
      console.log('Itens no carrinho:', itens);
    });
  }

  async removerItem(item: CartItem) {
    try {
      await this.carrinhoService.removeFromCart(item.id);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item do carrinho. Tente novamente.');
    }
  }

  async finalizarPagamento(metodo: string) {
    if (!metodo) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, selecione uma forma de pagamento.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const user = getAuth().currentUser;
    if (!user) {
      console.error('Nenhum usuário logado.');
      return;
    }

    this.compraFinalizada = false;

    if (metodo === 'pix') {
      const codigoPix = `E${Math.random().toString(36).substring(2, 15).toUpperCase()}F${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
      
      const valorTotal = await this.valorTotalCarrinho$.pipe(take(1)).toPromise();

      const modal = await this.modalController.create({
        component: PixModalPage,
        componentProps: {
          codigoPix: codigoPix,
          valorTotal: valorTotal
        }
      });

      await modal.present();

      // Espera o modal fechar para processar a compra
      const { data } = await modal.onWillDismiss();
      if (data === true) {
        await this.processarCompra('Pix');
      }

    } else {
      await this.processarCompra(metodo);
    }
  }

  async processarCompra(metodo: string) {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Processando pagamento...',
      duration: 3000,
      translucent: true,
      cssClass: 'custom-loading'
    });
    await loading.present();
    await loading.onDidDismiss();

    try {
      const carrinhoItens = await this.carrinhoItens$.pipe(take(1)).toPromise();
      await this.carrinhoService.finalizarCompra(carrinhoItens);
      
      const alert = await this.alertController.create({
        header: 'Pagamento Finalizado!',
        message: `Você escolheu pagar com ${metodo}. Agradecemos a preferência!`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/pedidos']);
          }
        }]
      });
      await alert.present();
      this.compraFinalizada = true;
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      const errorAlert = await this.alertController.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao finalizar a compra. Tente novamente.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}