// src/app/minhas-compras/minhas-compras.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Auth, user } from '@angular/fire/auth';
import { Database, object, ref, get } from '@angular/fire/database';

@Component({
  selector: 'app-minhas-compras',
  templateUrl: './minhas-compras.page.html',
  styleUrls: ['./minhas-compras.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class MinhasComprasPage implements OnInit {
  compras: any[] = [];

  constructor(
    private auth: Auth,
    private db: Database
  ) { }

  ngOnInit() {
    user(this.auth).subscribe(user => {
      if (user) {
        console.log('Usuário autenticado. UID:', user.uid);
        this.fetchCompras(user.uid);
      } else {
        console.log('Nenhum usuário logado.');
        this.compras = [];
      }
    });
  }

  async fetchCompras(uid: string) {
    try {
      const dbRef = ref(this.db, `usuarios/${uid}/compras`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        let comprasArray = Object.values(data);
        
        comprasArray.sort((a: any, b: any) => {
          const [dataA, horaA] = a.data.split(', ');
          const [diaA, mesA, anoA] = dataA.split('/').map(Number);
          const [horaObjA, minObjA, segObjA] = horaA.split(':').map(Number);
          const [dataB, horaB] = b.data.split(', ');
          const [diaB, mesB, anoB] = dataB.split('/').map(Number);
          const [horaObjB, minObjB, segObjB] = horaB.split(':').map(Number);
          const dateObjA = new Date(anoA, mesA - 1, diaA, horaObjA, minObjA, segObjA).getTime();
          const dateObjB = new Date(anoB, mesB - 1, diaB, horaObjB, minObjB, segObjB).getTime();
          return dateObjB - dateObjA;
        });

        this.compras = comprasArray;
        console.log('Compras ordenadas e carregadas:', this.compras);
      } else {
        this.compras = [];
        console.log('Nenhuma compra encontrada para este usuário.');
      }
    } catch (error) {
      console.error("Erro ao buscar as compras:", error);
      this.compras = [];
    }
  }
}