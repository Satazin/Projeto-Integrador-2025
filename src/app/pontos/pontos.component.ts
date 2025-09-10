import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { PontoService } from '../ponto/pontos-recom';

interface Produto {
  nome: string;
  pontos: number;
}

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
  
  // Lista de produtos para o select
  produtosDisponiveis: Produto[] = [
    { nome: 'Produto A', pontos: 50 },
    { nome: 'Produto B', pontos: 100 },
    { nome: 'Produto C', pontos: 200 }
  ];
  
  // Variável para armazenar o produto selecionado
  produtoSelecionado: Produto | null = null;

  constructor(private pontoService: PontoService) { }

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
    if (!this.produtoSelecionado) {
      alert('Por favor, selecione um produto para remover pontos.');
      return;
    }

    const pontosAtuais = await this.pontoService.lerPontos();
    const pontosParaRemover = this.produtoSelecionado.pontos;
    
    if (pontosParaRemover <= pontosAtuais) {
      await this.pontoService.removerPontos(pontosParaRemover);
      alert(`${pontosParaRemover} pontos removidos pela troca de ${this.produtoSelecionado.nome}!`);
      this.mostrarPontos(); // Atualiza a exibição dos pontos
    } else {
      alert('Pontos insuficientes!');
    }
  }
}