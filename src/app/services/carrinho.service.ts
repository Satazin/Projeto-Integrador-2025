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
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  
  private auth = getAuth();
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private rtdb: RealtimeDatabaseService) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
      if (user) {
        this.fetchCartItems();
      } else {
        this.cartItemsSubject.next([]);
      }
    });
  }

  private fetchCartItems(): void {
    const user = this.userSubject.getValue();
    if (!user) {
      this.cartItemsSubject.next([]);
      return;
    }
    const cartPath = `carrinhos/${user.uid}/itens`;
    this.rtdb.list(cartPath).subscribe(itens => {
      this.cartItemsSubject.next(itens);
    });
  }

  async adicionarAoCarrinho(item: Product, quantidade: number): Promise<void> {
    const user = this.userSubject.getValue();
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
    const user = this.userSubject.getValue();
    if (!user) {
      alert('Faça login para remover itens do carrinho.');
      return;
    }
    const itemPath = `carrinhos/${user.uid}/itens/${itemId}`;
    await this.rtdb.remove(itemPath);
  }

  private async clearCartFromDatabase(): Promise<void> {
    const user = this.userSubject.getValue();
    if (!user) {
      console.error('Nenhum usuário logado para limpar o carrinho.');
      return;
    }
    const cartPath = `carrinhos/${user.uid}/itens`;
    await this.rtdb.remove(cartPath);
    this.cartItemsSubject.next([]);
    console.log('Carrinho limpo localmente e no banco de dados.');
  }

  async finalizarCompra(): Promise<void> {
    const user = this.userSubject.getValue();
    if (!user) {
      console.error('Nenhum usuário logado para finalizar a compra.');
      return;
    }

    const userId = user.uid;
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
  
  // Método para puxar o histórico de compras - ajustado para o Observable
  getHistoricoDeCompras(): Observable<any[]> {
    const user = this.userSubject.getValue();
    if (!user) {
      return of([]);
    }
    const historicoPath = `usuarios/${user.uid}/compras`;

    return this.rtdb.list(historicoPath).pipe(
      map(purchases => {
        if (!purchases) {
          return [];
        }
        if (typeof purchases === 'object' && !Array.isArray(purchases)) {
          return Object.values(purchases);
        } else {
          return purchases;
        }
      })
    );
  }
}