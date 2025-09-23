import { Injectable } from '@angular/core';
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { map } from 'rxjs/operators';
import { PontoService } from '../ponto/pontos-recom'; // Importa o serviço de pontos

export interface Product {
  id: string;
  imagem: string;
  nome: string;
  preco: number;
  descricao?: string;
  imageUrl?: string;
  servings?: string;
  observacao?: string;
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

  constructor(
    private rtdb: RealtimeDatabaseService,
    private pontoService: PontoService // Injeta o PontoService
  ) {
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

  async finalizarCompra(carrinhoItens: CartItem[] | undefined): Promise<void> {
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
    
    // 1. Crie um array para os itens da compra e calcule o valor total
    let valorTotalDaCompra = 0;
    const itensComSubtotal = cartItems.map(item => {
      const subtotal = item.preco * item.quantidade;
      valorTotalDaCompra += subtotal; // Acumula o valor total
      return {
        ...item,
        // O preço salvo será o subtotal
        preco: subtotal 
      };
    });

    // 2. Chame o serviço de pontos para adicionar os pontos ganhos
    await this.pontoService.adicionarPontos(valorTotalDaCompra);

    const brasilTime = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });

    const purchase = {
      data: brasilTime,
      // Salve a compra com o novo array de itens processados
      itens: itensComSubtotal
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