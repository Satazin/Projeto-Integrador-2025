import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
})
export class CarrinhoPage implements OnInit {
  itens: any[] = [];
  subtotal = 0;
  total = 0;

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    this.itens = this.carrinhoService.getItens();
    this.atualizarTotais();
  }

  alterarQtd(item: any, delta: number) {
    item.quantidade += delta;
    if (item.quantidade < 1) item.quantidade = 1;
    this.atualizarTotais();
  }

  removerItem(item: any) {
    this.itens = this.itens.filter(i => i !== item);
    this.carrinhoService.limpar();
    this.itens.forEach(i => this.carrinhoService.adicionar(i, i.quantidade));
    this.atualizarTotais();
  }

  editarItem(item: any) {
    // Implemente se quiser editar detalhes do item
  }

  adicionarMaisProdutos() {
    // Navegue para pedidos
    window.location.href = '/pedidos';
  }

  voltar() {
    window.history.back();
  }

  continuar() {
    // Navegue para checkout ou próxima etapa
  }

  atualizarTotais() {
    this.subtotal = this.itens.reduce((sum, i) => sum + (parseFloat(i.preco.replace(',', '.')) * i.quantidade), 0);
    this.total = this.subtotal; // Adicione taxas se necessário
  }

  fecharCarrinho() {
    window.history.back();
  }
}