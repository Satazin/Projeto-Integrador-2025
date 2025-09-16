import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';

// Centraliza a interface para que todos os arquivos usem a mesma
export interface Produtos {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  servings?: string;
}

export interface CartItem extends Produtos {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class carrinho {
  private basePath = 'carrinhos'; 
  private userId = 'usuario-123'; 

  constructor(private rtdb: RealtimeDatabaseService) {}

  addToCart(item: Produtos, quantity: number): Promise<void> {
    const cartItemPath = `${this.basePath}/${this.userId}/itens/${item.id}`;
    const cartItem: CartItem = { ...item, quantity };
    
    // O seu serviço RealtimeDatabaseService precisa ter um método 'set'
    // que aceite o path e os dados.
    return this.rtdb.set(cartItemPath, cartItem);
  }

  getCartItems(): Observable<CartItem[]> {
    const cartPath = `${this.basePath}/${this.userId}/itens`;
    
    // Usa o pipe() com map() para transformar os dados da query
    return this.rtdb.list(cartPath).pipe(
        map(queryChanges => {
            // Itera sobre os resultados e extrai o valor real
            return queryChanges.map(change => {
                const item = change as any; // Usamos 'any' para evitar erros de tipagem
                return item.payload.val() as CartItem;
            });
        })
    );
  }

  removeFromCart(productId: string): Promise<void> {
    const itemPath = `${this.basePath}/${this.userId}/itens/${productId}`;
    return this.rtdb.remove(itemPath);
  }

  clearCart(): Promise<void> {
    const cartPath = `${this.basePath}/${this.userId}/itens`;
    return this.rtdb.remove(cartPath);
  }
}