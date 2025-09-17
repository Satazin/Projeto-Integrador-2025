import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarrinhoService, CartItem } from '../services/carrinho';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CarrinhoPage implements OnInit {
  carrinhoItens$: Observable<CartItem[]>;
  valorTotalCarrinho$: Observable<number>;

  constructor(private carrinhoService: CarrinhoService, private router: Router) {
    this.carrinhoItens$ = new Observable<CartItem[]>();
    this.valorTotalCarrinho$ = new Observable<number>();
  }

  ngOnInit() {
    // Obtem os itens do carrinho
    this.carrinhoItens$ = this.carrinhoService.cartItems$;

    // Calcula o valor total do carrinho de forma reativa
    this.valorTotalCarrinho$ = this.carrinhoItens$.pipe(
      map(itens => itens.reduce((total, item) => total + item.preco * item.quantidade, 0))
    );

    // Apenas para depuração
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

  async incrementarQuantidade(item: CartItem) {
    try {
      await this.carrinhoService.updateCartItem(item.id, item.quantidade + 1);
      console.log('Quantidade incrementada com sucesso!');
    } catch (error) {
      console.error('Erro ao incrementar quantidade:', error);
      alert('Erro ao atualizar a quantidade do item. Tente novamente.');
    }
  }

  async decrementarQuantidade(item: CartItem) {
    if (item.quantidade > 1) {
      try {
        await this.carrinhoService.updateCartItem(item.id, item.quantidade - 1);
        console.log('Quantidade decrementada com sucesso!');
      } catch (error) {
        console.error('Erro ao decrementar quantidade:', error);
        alert('Erro ao atualizar a quantidade do item. Tente novamente.');
      }
    } else {
      alert('A quantidade mínima é 1. Para remover o item, use o botão de exclusão.');
    }
  }

  voltar() {
    // Navega para a página anterior
    this.router.navigate(['/home']);
  }

  continuar() {
    // Navega para a página de checkout ou próxima etapa
    this.router.navigate(['/checkout']);
  }
}