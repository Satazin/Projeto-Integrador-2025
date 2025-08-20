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
  IonAvatar 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonAvatar,
    IonList,
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

  constructor() {}

  ngOnInit() {
  }

}
