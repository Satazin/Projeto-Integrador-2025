import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CarrinhoService, CartItem } from '../services/carrinho.service';
import { getAuth } from 'firebase/auth';
import { Router, RouterModule } from '@angular/router'; // Adicione RouterModule aqui

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] // Mude de "Router" para "RouterModule"
})
export class CarrinhoPage implements OnInit {
  carrinhoItens$: Observable<CartItem[]>;
  public formaPagamento: string = '';
  public compraFinalizada: boolean = false; // controla exibição do card finalizado

  constructor(
    private carrinhoService: CarrinhoService,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController, // injetar LoadingController
    private router: Router
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
    const user = getAuth().currentUser;

    if (!user) {
      console.error('Nenhum usuário logado.');
      return;
    }

    this.compraFinalizada = false; // resetar estado do card finalizado

    // Criar e apresentar o loading spinner
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Processando pagamento...',
      duration: 3000,
      translucent: true,
      cssClass: 'custom-loading'
    });

    await loading.present();

    // Espera o loading fechar automaticamente após duração
    await loading.onDidDismiss();

    // Após o loading, exibe o alert de confirmação
    const alert = await this.alertController.create({
      header: 'Pagamento Finalizado!',
      message: `Você escolheu pagar com ${metodo}. Agradecemos a preferência!`,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Fecha o modal e navega para a tela de pedidos
            this.modalController.dismiss();
            this.router.navigate(['/pedidos']);
          }
        }
      ]
    });

    await alert.present();

    // Exibe o card de compra finalizada (se você tiver um no template)
    this.compraFinalizada = true;

    // Finaliza a compra e fecha o modal
    await this.carrinhoService.finalizarCompra();
    this.modalController.dismiss();
  }
}