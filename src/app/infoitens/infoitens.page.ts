import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { RealtimeDatabaseService } from '../firebase/realtime-databse';
import { CarrinhoService } from '../services/carrinho.service';

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
  observacao: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rt: RealtimeDatabaseService,
    private carrinhoService: CarrinhoService,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.item = nav?.extras?.state?.['item'];

    if (this.item) {
      this.loading = false;
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID do item não informado.';
      this.loading = false;
      return;
    }

    try {
      const snapshot: any = await this.rt.get(`pedidos/${id}`);
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

  async adicionarAoCarrinho() {
    if (this.item) {
      const loading = await this.loadingController.create({
        message: 'Adicionando ao carrinho...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        // Envia a observação junto com o item
        await this.carrinhoService.adicionarAoCarrinho(
          { ...this.item, observacao: this.observacao },
          this.quantidade
        );
        console.log('Item adicionado ao carrinho com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        alert('Erro ao adicionar item ao carrinho. Tente novamente.');
      } finally {
        await loading.dismiss();
      }
    } else {
      alert('Não foi possível adicionar o item ao carrinho.');
    }
  }
}
