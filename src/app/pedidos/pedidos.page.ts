import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButtons,
  IonIcon, 
  IonButton, 
  IonAvatar,
  IonMenuButton,
  IonMenu,
  AlertController,
  LoadingController // Importe o LoadingController
} from '@ionic/angular/standalone';

import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { AuthService } from '../services/auth'; 
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    IonAvatar, IonButton, IonIcon,
    CommonModule, FormsModule, RouterLink,
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
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController // Injete o LoadingController
  ) {}

  async ngOnInit() {
    await this.carregarDados();
  }

  ngAfterViewInit() {
    const content = this.elRef.nativeElement.querySelector('ion-content');
    if (content) {
      content.addEventListener('ionScroll', () => this.onScroll());
    }
  }

  // NOVA FUNÇÃO ASYNC PARA CARREGAR OS DADOS
  async carregarDados() {
    const loading = await this.loadingController.create({
      message: 'Carregando...',
    });
    await loading.present();

    try {
      // Usando uma Promise para converter a lógica de callback do `query`
      const dados = await new Promise<any>((resolve, reject) => {
        this.rt.query('/pedidos', (snapshot: any) => {
          const dados = snapshot.val();
          resolve(dados);
        });
      });

      if (dados) {
        this.pedidos = Object.keys(dados).map(key => ({
          id: key,
          ...dados[key]
        }));
      } else {
        this.pedidos = [];
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Você pode exibir um alerta de erro aqui
    } finally {
      await loading.dismiss(); // Sempre feche o loading
    }
  }

  // LISTAR PEDIDOS DO FIREBASE - a função original 'listar' foi movida para 'carregarDados'
  // Deixei o método aqui mas com a lógica removida, para fins de exemplo
  listar() {
    // A lógica de carregamento agora está em 'carregarDados'
    console.log('Dados carregados via ngOnInit');
  }

  // FILTRAR POR CATEGORIA
  itensPorCategoria(cat: string) {
    return this.pedidos.filter(i => i.categoria === cat)
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

  // MARCAR QUAL CATEGORIA ESTÁ EM FOCO
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

  // Nova função para verificar o login e navegar
  async abrirPerfil() {
    const usuarioLogado = this.authService.usuarioLogado;
    if (usuarioLogado) {
      this.router.navigate(['/perfil']);
    } else {
      const alert = await this.alertController.create({
        header: 'Acesso Restrito',
        message: 'Por favor, faça login para acessar seu perfil.',
        buttons: ['Cancelar', { text: 'Login', handler: () => this.router.navigate(['/login']) }]
      });
      await alert.present();
    }
  }
}