import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonBadge,
  IonItem,
  IonButtons,
  IonIcon,
  IonButton,
  IonAvatar,
  IonMenuButton,
  IonMenu,
  AlertController,
  LoadingController, IonFooter, IonLabel } from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { CarrinhoService } from '../services/carrinho.service';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonButton, IonIcon,
    CommonModule, FormsModule, RouterLink, IonBadge,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonButtons, IonMenuButton, IonMenu
  ]
})
export class PedidosPage implements OnInit, AfterViewInit {
  public pedidos: any[] = [];
  public categorias = [
    { id: 'poke', nome: 'POKE' },
    { id: 'temaki', nome: 'TEMAKI' },
    { id: 'yakisoba', nome: 'YAKISOBA' },
    { id: 'sushi', nome: 'SUSHI' },
    { id: 'niguiris', nome: 'NIGUIRIS' },
    { id: 'hot', nome: 'HOT' },
    { id: 'bebidas', nome: 'BEBIDAS' },
  ];
  public categoriaEmFoco: string = 'poke';
  termoBusca: string = '';

  constructor(
    private rt: RealtimeDatabaseService,
    private elRef: ElementRef,
    private router: Router,
    private carrinhoService: CarrinhoService,
    public authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.listar();
  }

  ngAfterViewInit() {
    const content = this.elRef.nativeElement.querySelector('ion-content');
    if (content) {
      content.addEventListener('ionScroll', () => this.onScroll());
    }
  }

  // LISTAR PEDIDOS DO FIREBASE
  listar() {
    this.rt.query('/pedidos', (snapshot: any) => {
      const dados = snapshot.val();
      if (dados) {
        this.pedidos = Object.keys(dados).map(key => ({
          id: key,
          ...dados[key]
        }));
      } else {
        this.pedidos = [];
      }
    });
  }

  // FILTRAR POR CATEGORIA E BUSCA
  itensPorCategoria(cat: string) {
    return this.pedidos
      .filter(i => i.categoria === cat)
      .filter(i =>
        !this.termoBusca ||
        i.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        i.descricao.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
  }

  // SCROLL SUAVE PARA A CATEGORIA
  scrollToCategoria(catId: string) {
    const el = this.elRef.nativeElement.querySelector('#' + catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onScroll() {
    const scrollEl = this.elRef.nativeElement.querySelector('ion-content');
    if (scrollEl) {
      scrollEl.getScrollElement().then((element: any) => {
        let found = this.categorias[0].id;
        for (const cat of this.categorias) {
          const el = this.elRef.nativeElement.querySelector('#' + cat.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < 130) {
              found = cat.id;
            }
          }
        }
        this.categoriaEmFoco = found;
      });
    }
  }

  abrirInfoItem(item: any) {
    this.router.navigate(['/infoitens', item.id], { state: { item } });
  }

  async abrirPerfil() {
    const usuarioLogado = this.authService.usuarioLogado;
    if (usuarioLogado) {
      this.router.navigate(['/perfil']);
    } else {
      const alert = await this.alertController.create({
          header: 'Acesso Restrito',
        message: `Voce precisa estar logado para acessar o perfil.`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Logar',
            handler: () => { this.router.navigate(['/login']); },
          },
        ],
      });
      await alert.present();
    }
  }

  limparBusca() {
  this.termoBusca = '';
}

async deletarItem(id: string, nome: string) {
  const alert = await this.alertController.create({
    header: 'Excluir item',
    message: `Deseja mesmo excluir ${nome}?`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        handler: () => this.rt.remove(`/pedidos/${id}`),
      },
    ],
  });
  await alert.present();
}


}
