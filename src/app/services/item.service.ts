// src/app/services/item.service.ts
import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { FirebaseApp } from '@angular/fire/app';

export interface Item {
  categoria: string;
  nome: string;
  descricao: string;
  serve: string;
  preco: number;
  imagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private db: Firestore;

  constructor(private app: FirebaseApp) {
    this.db = getFirestore(this.app);
  }

  async salvarItem(item: Item): Promise<void> {
    const itensCollection = collection(this.db, 'itens');
    await addDoc(itensCollection, item);
  }

  getItems(): Observable<Item[]> {
    const itensCollection = collection(this.db, 'itens');
    return new Observable(observer => {
      onSnapshot(itensCollection, (snapshot) => {
        const itens: Item[] = [];
        snapshot.docs.forEach(doc => {
          itens.push(doc.data() as Item);
        });
        observer.next(itens);
      });
    });
  }
}