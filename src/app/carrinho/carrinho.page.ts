import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonItem, IonList, IonLabel, IonCardContent, IonCard } from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonLabel, IonList, IonItem, IonButton, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CarrinhoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
