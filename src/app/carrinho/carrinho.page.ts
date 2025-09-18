// src/app/carrinho/carrinho.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CarrinhoService, CartItem } from '../services/carrinho';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarrinhoPage implements OnInit {
  carrinhoItens$: Observable<CartItem[]>;
  public metodoPagamento: string = '';

  constructor(
    private carrinhoService: CarrinhoService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.carrinhoItens$ = this.carrinhoService.cartItems$;
  }

  ngOnInit() {
    this.carrinhoItens$.subscribe(itens => {
      console.log('Dados do carrinho recebidos:', itens);
    });
  }

  async removerItem(item: CartItem) {
    try {
      await this.carrinhoService.removeFromCart(item.id);
      console.log('Item removido do carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item do carrinho. Tente novamente.');
    }
  }

  get valorTotalCarrinho(): number {
    let total = 0;
    this.carrinhoItens$.subscribe(itens => {
      itens.forEach(item => {
        total += item.preco * item.quantidade;
      });
    }).unsubscribe();
    return total;
  }
  
  async finalizarPagamento(metodo: string) {
    const alert = await this.alertController.create({
      header: 'Pagamento Finalizado!',
      message: `Você escolheu pagar com ${metodo}. Agradecemos a preferência!`,
      buttons: ['OK']
    });

    await alert.present();

    await this.carrinhoService.finalizarCompra();
    this.modalController.dismiss();
  }
}