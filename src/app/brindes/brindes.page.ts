import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-brindes',
  templateUrl: './brindes.page.html',
  styleUrls: ['./brindes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]


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
