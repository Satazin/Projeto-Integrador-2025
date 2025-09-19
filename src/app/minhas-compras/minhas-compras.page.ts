// src/app/minhas-compras/minhas-compras.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importe os módulos do Firebase para a versão mais recente
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
        this.compras = Object.values(data);
        console.log('Compras carregadas:', this.compras);
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