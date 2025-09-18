import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarrinhoService, CartItem } from '../services/carrinho.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CarrinhoPage implements OnInit {
  carrinhoItens$: Observable<CartItem[]>;

  constructor(private carrinhoService: CarrinhoService) {
    this.carrinhoItens$ = new Observable<CartItem[]>();
  }

  ngOnInit() {
    this.carrinhoItens$ = this.carrinhoService.cartItems$;
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
}