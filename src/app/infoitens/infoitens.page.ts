import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { CarrinhoService } from '../services/carrinho.service';
import { Auth, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { AuthService } from '../services/auth';

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
    private authService: AuthService
  ) {
    this.authInstance = getAuth(initializeApp(environment.firebaseConfig));
  }

  async ngOnInit() {
    this.authUnsubscribe = onAuthStateChanged(this.authInstance, (user: User | null) => {
      this.isAdminMode = this.authService.isAdmin();
      console.log(`[AUTH CHECK - LISTENER] Usuário carregado. É ADM? ${this.isAdminMode}`);
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

  // ✅ FUNÇÃO PARA REMOVER O LISTENER AO DESTRUIR A PÁGINA
  ngOnDestroy(): void {
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  }

  // [Restante do código]
  get valorTotal() {
    return (parseFloat(this.item?.preco?.toString().replace(',', '.')) || 0) * this.quantidade;
  }

  alterarQtd(valor: number) {
    if (this.quantidade + valor >= 1) {
      this.quantidade += valor;
    }
  }

  // Métodos de ação (inalterados)

  async salvarItemMestre() {
    if (!this.isAdminMode) {
      await this.showAlert('Acesso Negado', 'Você não tem permissão de administrador para editar este item.');
      return;
    }
    // ... restante da lógica de salvar
    if (!this.item || !this.item.id) {
      await this.showAlert('Erro', 'Item não carregado ou sem ID para salvar.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando item mestre...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const dadosParaSalvar = {
        ...this.item,
        observacao: this.observacao
      };

      delete dadosParaSalvar.id;
      await this.rt.update(`pedidos/${this.item.id}`, dadosParaSalvar);
      await this.showAlert('Sucesso!', 'Item mestre atualizado com sucesso no banco de dados.', ['OK']);
      this.router.navigate(['/pedidos']);
    } catch (error) {
      console.error('Erro ao salvar item mestre:', error);
      await this.showAlert('Erro', 'Falha ao salvar item mestre. Verifique o console.');
    } finally {
      await loading.dismiss();
    }
  }

  async adicionarAoCarrinho() {
    if (this.isAdminMode) {
      await this.showAlert('Atenção', 'Use o botão "Salvar Item Mestre" para editar as informações do menu.');
      return;
    }
    // ... restante da lógica de carrinho
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
