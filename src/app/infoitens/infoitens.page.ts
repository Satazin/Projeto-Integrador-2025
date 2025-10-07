import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController, Platform } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { CarrinhoService } from '../services/carrinho.service';
import { AuthService } from '../services/auth';
import { Auth, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-infoitens',
  templateUrl: './infoitens.page.html',
  styleUrls: ['./infoitens.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InfoitensPage implements OnInit, OnDestroy {
  item: any = null;
  quantidade = 1;
  loading = true;
  errorMessage: string | null = null;
  observacao: string = '';

  isAdminMode: boolean = false;

  private authUnsubscribe: (() => void) | undefined;
  private authInstance: Auth;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rt: RealtimeDatabaseService,
    private carrinhoService: CarrinhoService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private platform: Platform
  ) {
    const firebaseApp = initializeApp(environment.firebaseConfig);
    this.authInstance = getAuth(firebaseApp);
  }

  async ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.authInstance, (user: User | null) => {
      this.isAdminMode = this.authService.isAdmin();
    });

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

  ngOnDestroy(): void {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
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
      await this.showAlert('Erro', 'Não foi possível adicionar o item ao carrinho.', ['OK']);
      return;
    }

    const user = this.authService.usuarioLogado;
    if (!user) {
      const alert = await this.alertController.create({
        header: 'Acesso Restrito',
        message: 'Para adicionar itens ao carrinho, você precisa estar logado.',
        buttons: [
          { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
          { text: 'Login', handler: () => { this.router.navigate(['/login']); } },
        ],
      });
      await alert.present();
      return;
    }

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

      await this.showAlert('Sucesso!', 'Item adicionado ao carrinho.', [
        { text: 'OK', handler: () => { this.router.navigate(['/pedidos']); } }
      ]);

    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      await this.showAlert('Erro', 'Erro ao adicionar item ao carrinho. Tente novamente.');
    } finally {
      await loading.dismiss();
    }
  }

  async showAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons
    });
    await alert.present();
  }

  abrirItemParaEdicao(item: any) {
    if (this.isAdminMode) {
      this.router.navigate(['/item-edit', item.id], {
        state: { item }
      });
    }
  }
}
