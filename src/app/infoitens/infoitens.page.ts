import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { CarrinhoService } from '../services/carrinho.service';
import { AuthService } from '../services/auth'; // Importe o AuthService

@Component({
  selector: 'app-infoitens',
  templateUrl: './infoitens.page.html',
  styleUrls: ['./infoitens.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InfoitensPage implements OnInit {
  item: any = null;
  quantidade = 1;
  loading = true;
  errorMessage: string | null = null;
  observacao: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rt: RealtimeDatabaseService,
    private carrinhoService: CarrinhoService,
    private loadingController: LoadingController,
    private alertController: AlertController, // Injeta o AlertController
    private authService: AuthService // Injeta o AuthService
  ) {}

  async ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.item = nav?.extras?.state?.['item'];

    if (this.item) {
      this.loading = false;
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID do item não informado.';
      this.loading = false;
      return;
    }

    try {
      const snapshot: any = await this.rt.get(`pedidos/${id}`);
      if (snapshot.exists()) {
        this.item = { id, ...snapshot.val() };
      } else {
        this.errorMessage = 'Item não encontrado.';
      }
    } catch (err) {
      console.error('Erro ao buscar item:', err);
      this.errorMessage = 'Erro ao carregar item.';
    } finally {
      this.loading = false;
    }
  }

  get valorTotal() {
    return (parseFloat(this.item?.preco?.toString().replace(',', '.')) || 0) * this.quantidade;
  }

  alterarQtd(valor: number) {
    if (this.quantidade + valor >= 1) {
      this.quantidade += valor;
    }
  }

  async adicionarAoCarrinho() {
    if (!this.item) {
      alert('Não foi possível adicionar o item ao carrinho.');
      return;
    }

    // Verifica se o usuário está logado
    const user = this.authService.usuarioLogado;
    if (!user) {
      const alert = await this.alertController.create({
        header: 'Acesso Restrito',
        message: 'Para adicionar itens ao carrinho, você precisa estar logado.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Fazer Login',
            handler: () => {
              this.router.navigate(['/login']); // Navega para a página de login
            },
          },
        ],
      });
      await alert.present();
      return; // Interrompe a função aqui
    }

    // Se o usuário estiver logado, continue com a lógica de adicionar ao carrinho
    const loading = await this.loadingController.create({
      message: 'Adicionando ao carrinho...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.carrinhoService.adicionarAoCarrinho(
        { ...this.item, observacao: this.observacao },
        this.quantidade
      );
      console.log('Item adicionado ao carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      alert('Erro ao adicionar item ao carrinho. Tente novamente.');
    } finally {
      await loading.dismiss();
    }
  }
}