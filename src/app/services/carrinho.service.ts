// src/app/services/carrinho.service.ts
import { Injectable } from '@angular/core';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { map } from 'rxjs/operators';

export interface Product {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
  imageUrl?: string;
  servings?: string;
}

export interface CartItem extends Product {
imagem: any;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  updateCartItem(id: string, arg1: number) {
    throw new Error('Method not implemented.');
  }
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
    const cartItem: CartItem = {
      ...item, quantidade,
      imagem: undefined
    };
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

  private async clearCartFromDatabase(): Promise<void> {
    if (!this.user) {
      console.error('Nenhum usuário logado para limpar o carrinho.');
      return;
    }
    const cartPath = `carrinhos/${this.user.uid}/itens`;
    await this.rtdb.remove(cartPath);
    this.cartItemsSubject.next([]);
    console.log('Carrinho limpo localmente e no banco de dados.');
  }

  async finalizarCompra(): Promise<void> {
    if (!this.user) {
      console.error('Nenhum usuário logado para finalizar a compra.');
      return;
    }
    const userId = this.user.uid;
    const cartItems = this.cartItemsSubject.getValue();
    if (cartItems.length === 0) {
      console.log('Carrinho está vazio. Nenhuma compra para finalizar.');
      return;
    }
    const brasilTime = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
    const purchase = {
      data: brasilTime, 
      itens: cartItems
    };
    const purchasePath = `usuarios/${userId}/compras/${Date.now()}`;
    await this.rtdb.set(purchasePath, purchase);
    await this.clearCartFromDatabase();
    console.log('Compra finalizada e histórico salvo.');
  }

 getHistoricoDeCompras(): Observable<any[]> {
    if (!this.user) {
      return of([]);
    }
    const historicoPath = `usuarios/${this.user.uid}/compras`;
    return this.rtdb.list(historicoPath).pipe(
      map(purchasesObject => {
        if (!purchasesObject) return [];
          const purchasesArray = Object.values(purchasesObject);
        return purchasesArray;
      })
    );
  }
}