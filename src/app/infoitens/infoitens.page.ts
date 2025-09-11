import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';

@Component({
  selector: 'app-infoitens',
  templateUrl: './infoitens.page.html',
  styleUrls: ['./infoitens.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InfoitensPage implements OnInit {
  item: any = null;
  quantidade = 1;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rt: RealtimeDatabaseService
  ) {}

  async ngOnInit() {
    // tenta pegar do state
    const nav = this.router.getCurrentNavigation();
    this.item = nav?.extras?.state?.['item'];

    if (this.item) {
      this.loading = false;
      return;
    }

    // fallback: busca no Firebase pelo id da rota
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID do item não informado.';
      this.loading = false;
      return;
    }

    try {
      const snapshot: any = await this.rt.get(`/pedidos/${id}`);
      if (snapshot.exists()) {
        this.item = { id, ...snapshot.val() };
      } else {
        this.errorMessage = 'Item não encontrado.';
      }
    } catch (err) {
      console.error('Erro ao buscar item:', err);
      this.errorMessage = 'Erro ao carregar item.';
    } finally {
      this.loading = false;
    }
  }

  get valorTotal() {
    return (parseFloat(this.item?.preco?.toString().replace(',', '.')) || 0) * this.quantidade;
  }

  alterarQtd(valor: number) {
    if (this.quantidade + valor >= 1) {
      this.quantidade += valor;
    }
  }

  adicionarAoCarrinho() {
    console.log('Adicionado ao carrinho:', { ...this.item, quantidade: this.quantidade });
  }
}
