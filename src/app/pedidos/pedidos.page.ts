import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonMenu, 
  IonIcon, 
  IonButton,
  IonButtons, 
  IonMenuButton, 
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonAvatar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonImg } from '@ionic/angular/standalone';
import { ProductService, Product } from '../service/product'; // ADDED

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonCard, IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonButtons,
    IonButton, 
    IonIcon, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule,
    FormsModule, 
    IonMenu, 
    IonMenuButton, 
    RouterLink
  ]
})
export class PedidosPage implements OnInit {

  products: Product[] = []; // ADDED

  constructor(private productService: ProductService) {} // MODIFIED

  async ngOnInit() {
    this.products = await this.productService.getAll(); // ADDED
  }

}