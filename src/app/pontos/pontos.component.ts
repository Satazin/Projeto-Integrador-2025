import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { PontoService } from '../ponto/pontos-recom'; 

@Component({
  selector: 'app-pontos',
  templateUrl: './pontos.component.html',
  styleUrls: ['./pontos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PontosPage {
  valorCompra: number = 0;
  pontosUsuario: number = 0;
  pontosRemover: number = 0;

  constructor(private pontoService: PontoService) {}

  async mostrarPontos() {
    this.pontosUsuario = await this.pontoService.lerPontos();
    alert(`Você tem ${this.pontosUsuario} pontos.`);
  }

  async adicionarPontos() {
    if (this.valorCompra > 0) {
      await this.pontoService.adicionarPontos(this.valorCompra);
      this.valorCompra = 0; 
      alert('Pontos adicionados com sucesso!');
    } else {
      alert('Por favor, insira um valor válido para a compra.');
    }
  }

   async removerPontos() {
    if (this.pontosRemover > 0) {
      await this.pontoService.removerPontos(this.pontosRemover);
      alert(`${this.pontosRemover} pontos removidos!`);
      this.mostrarPontos();
    } else {
      alert('Por favor, insira um valor válido para remover.');
    }
  }
}