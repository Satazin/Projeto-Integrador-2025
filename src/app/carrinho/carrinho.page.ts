import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CarrinhoService, CartItem } from '../services/carrinho.service';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { getDatabase, ref, get } from "firebase/database";
import { Router, RouterModule } from '@angular/router';
import { PixModalPage } from '../pix-modal/pix-modal.page';
import { PontoService } from '../ponto/pontos-recom';

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
  quantidade = 1;
  carrinhoItens$: Observable<CartItem[]>;
  valorTotalCarrinho$: Observable<number>;
  public pontosGanhos$: Observable<number>;
  public formaPagamento: string = '';
  public compraFinalizada: boolean = false; 
  public enderecoEntrega: string = 'Carregando endereço...';
  private userId: string | null = null;
  private dbRT;

  constructor(
    private carrinhoService: CarrinhoService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private router: Router,
    private auth: Auth,
    public pontoService: PontoService
  ) {
    this.dbRT = getDatabase();
    this.carrinhoItens$ = this.carrinhoService.cartItems$;
    this.valorTotalCarrinho$ = this.carrinhoItens$.pipe(
      map(itens =>
        itens.reduce((total, item) => total + item.preco * item.quantidade, 0)
      )
    );

     this.pontosGanhos$ = this.valorTotalCarrinho$.pipe(
      map(valorTotal => this.pontoService.calcularPontosGanhos(valorTotal))
    );
  }

  ngOnInit() {
    this.carrinhoItens$.subscribe(itens => {
      console.log('Itens no carrinho:', itens);
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.carregarEndereco();
      } else {
        this.enderecoEntrega = 'Usuário não logado. Faça login para ver o endereço.';
      }
    });
  }

  async carregarEndereco() {
    if (!this.userId) return;
    try {
      const enderecoRef = ref(this.dbRT, 'usuarios/' + this.userId + '/endereco');
      const enderecoSnap = await get(enderecoRef);

      if (enderecoSnap.exists()) {
        this.enderecoEntrega = enderecoSnap.val();
      } else {
        this.enderecoEntrega = 'Nenhum endereço de entrega salvo. Por favor, preencha no Perfil.';
      }
    } catch (error) {
      console.error('Erro ao carregar endereço do RTDB:', error);
      this.enderecoEntrega = 'Falha ao carregar endereço.';
    }
  }

  async removerItem(item: CartItem) {
    try {
      await this.carrinhoService.removeFromCart(item.id);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      const errorAlert = await this.alertController.create({
        header: 'Erro',
        message: 'Erro ao remover item do carrinho. Tente novamente.',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }

  async finalizarPagamento(metodo: string) {
    if (this.enderecoEntrega.includes('Nenhum endereço') || this.enderecoEntrega.includes('Falha')) {
      const addressAlert = await this.alertController.create({
        header: 'Endereço Necessário',
        message: 'Por favor, defina um endereço de entrega válido no seu Perfil antes de finalizar.',
        buttons: ['OK']
      });
      await addressAlert.present();
      return;
    }

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
      const loginAlert = await this.alertController.create({
        header: 'Atenção',
        message: 'Você precisa estar logado para finalizar a compra.',
        buttons: ['OK']
      });
      await loginAlert.present();
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
  alterarQtd(valor: number) {
    if (this.quantidade + valor >= 1) {
      this.quantidade += valor;
    }
  }
}