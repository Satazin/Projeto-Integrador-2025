import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';

export interface Produtos {
imagem: any;
nome: any;
serve: any;
preco: any;
descricao: any;
  id?: string | number;
  name: string;
  description?: string;
  price: number;
  servings?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  stock?: number;
  createdAt?: number;
}

@Injectable({ providedIn: 'root' })
export class produto {
  private basePath = 'produtos';

  constructor(private rtdb: RealtimeDatabaseService) {}

  async create(product: Partial<Produtos>): Promise<any> {
    product.createdAt = Date.now();
    return this.rtdb.add(this.basePath, product);
  }

  async getAll(): Promise<Produtos[]> {
    const snapshot: any = await firstValueFrom(this.rtdb.list(this.basePath));
    if (!snapshot) return [];
    if (Array.isArray(snapshot)) {
      return snapshot.map((s, i) => ({ id: s?.id ?? i + 1, ...s }));
    }
    if (typeof snapshot === 'object') {
      return Object.keys(snapshot).map(k => ({ id: k, ...snapshot[k] }));
    }
    return [];
  }

  async getById(id: string | number): Promise<Produtos | null> {
    const all = await this.getAll();
    return all.find(p => String(p.id) === String(id)) ?? null;
  }

  async update(id: string | number, data: Partial<Produtos>) {
    await this.rtdb.add(this.basePath, data, Number(id));
  }

  async delete(id: string | number) {
    await this.rtdb.remove(`${this.basePath}/${id}`);
  }
}