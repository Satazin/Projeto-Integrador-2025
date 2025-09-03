import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonGrid, IonRow, IonCardContent, IonCol, } from '@ionic/angular/standalone';

@Component({
  selector: 'app-brindes',
  templateUrl: './brindes.page.html',
  styleUrls: ['./brindes.page.scss'],
  standalone: true,
  imports: [IonCol, IonCardContent, IonRow, IonGrid, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule ]


})
export class BrindesPage implements OnInit {
pontos: number = 7000;
descricaoAtiva: string | null = null;
  toggleDescricao(id: string) {
    this.descricaoAtiva = this.descricaoAtiva === id ? null : id;}
  constructor() { }

  ngOnInit() {
    
  }

}
