// src/app/services/carrinho.service.ts
import { Injectable } from '@angular/core';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';

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

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private user: User | null = null;
  private auth = getAuth();
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private itens: any[] = [];
  private quantidadeSubject = new BehaviorSubject<number>(0);
  quantidade$ = this.quantidadeSubject.asObservable();

  constructor(private rtdb: RealtimeDatabaseService) {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        this.fetchCartItems();
      } else {
        this.cartItemsSubject.next([]);
      }
    });
  }

  private fetchCartItems(): void {
    if (!this.user) {
      this.cartItemsSubject.next([]);
      return;
    }
    const cartPath = `carrinhos/${this.user.uid}/itens`;
    this.rtdb.list(cartPath).subscribe(itens => {
      this.cartItemsSubject.next(itens);
    });
  }

  async adicionarAoCarrinho(item: Product, quantidade: number): Promise<void> {
    const user = this.user;
    if (!user) {
      alert('Faça login para adicionar itens ao carrinho.');
      return;
    }
    const userId = user.uid;
    const itemRef = `carrinhos/${userId}/itens/${item.id}`;
    const cartItem: CartItem = { ...item, quantidade };
    await this.rtdb.set(itemRef, cartItem);
  }

  async removeFromCart(itemId: string): Promise<void> {
    if (!this.user) {
      alert('Faça login para remover itens do carrinho.');
      return;
    }
    const itemPath = `carrinhos/${this.user.uid}/itens/${itemId}`;
    await this.rtdb.remove(itemPath);
  }

  adicionar(item: any, quantidade: number) {
    const existente = this.itens.find(i => i.id === item.id);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      this.itens.push({ ...item, quantidade });
    }
    this.quantidadeSubject.next(this.getQuantidadeTotal());
  }

  getQuantidadeTotal() {
    return this.itens.reduce((total, i) => total + i.quantidade, 0);
  }

  getItens() {
    return this.itens;
  }
}