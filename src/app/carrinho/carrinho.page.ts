import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CarrinhoService, CartItem } from '../services/carrinho.service';
import { getAuth } from 'firebase/auth';
import { Router, RouterModule } from '@angular/router'; // Adicione RouterModule aqui
import { take } from 'rxjs/operators';

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
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.modalController.dismiss();
              this.router.navigate(['/pedidos']);
            }
          }
        ]
      });
  
      await alert.present();
      this.compraFinalizada = true;
      this.modalController.dismiss();
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      // Exibe um alerta de erro caso algo dê errado
      const errorAlert = await this.alertController.create({
        header: 'Erro',
        message: 'Ocorreu um erro ao finalizar a compra. Tente novamente.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}