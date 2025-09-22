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
} from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';

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
    { id: 'hot', nome: 'PORÇÕES HOT' },
    { id: 'urumakis', nome: 'URUMAKIS' },
    { id: 'acompanhamentos', nome: 'ACOMPANHAMENTOS' },
    { id: 'combos', nome: 'COMBOS' },
    { id: 'bebidas', nome: 'BEBIDAS' },
    { id: 'sobremesas', nome: 'SOBREMESAS' }
  ];
  public categoriaEmFoco: string = 'poke';
  termoBusca: string = '';

  constructor(
    private rt: RealtimeDatabaseService,
    private elRef: ElementRef,
    private router: Router
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

  entrarComoAdm() {
    this.router.navigate(['/adm-login']);
  }

}