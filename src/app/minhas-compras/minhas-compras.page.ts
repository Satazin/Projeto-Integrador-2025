// src/app/minhas-compras/minhas-compras.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CarrinhoService } from '../services/carrinho';

// Re-defina as interfaces que você já tem no serviço
export interface Product {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  imageUrl?: string;
  servings?: string;
}

export interface CartItem extends Product {
  quantidade: number;
}

@Component({
  selector: 'app-minhas-compras',
  templateUrl: './minhas-compras.page.html',
  styleUrls: ['./minhas-compras.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MinhasComprasPage implements OnInit {
  historicoDeCompras$: Observable<any[]> | undefined;

  constructor(private carrinhoService: CarrinhoService) { }

  ngOnInit() {
    this.historicoDeCompras$ = this.carrinhoService.getHistoricoDeCompras();
  }

  getItem(item: any): CartItem {
    return item.value;
  }
}