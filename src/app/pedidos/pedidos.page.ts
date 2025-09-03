import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterLink
  ]
})
export class PedidosPage implements OnInit, AfterViewInit {
  categorias = [
    { id: 'poke', nome: 'POKE' },
    { id: 'temaki', nome: 'TEMAKI' },
    { id: 'yakisoba', nome: 'YAKISOBA' }
  ];

  categoriaEmFoco = 'poke';

  itens = [
    // POKE
    {
      categoria: 'poke',
      nome: 'Poke Nepal (G)',
      descricao: 'Arroz japonês ou mix de folhas, salmão furai, cream cheese, cebola roxa, tomate cereja, mix de gergelim...',
      serve: '1 pessoa',
      preco: '55,91',
      imagem: 'assets/pokenepal.jpg'
    },
    {
      categoria: 'poke',
      nome: 'Poke Palau (G)',
      descricao: 'Arroz japonês ou mix de folhas, barriga de salmão selado, azeite trufado, tomate cereja, chips de banana...',
      serve: '1 pessoa',
      preco: '57,90',
      imagem: 'assets/pokepalau.jpg'
    },
    {
      categoria: 'poke',
      nome: 'Poke Haiti (G)',
      descricao: 'Base de arroz gohan, salmão grelhado, molho tarê, sunomono, couve crispy, ervilha wasabi, chips de batata doce...',
      serve: '1 pessoa',
      preco: '56,90',
      imagem: 'assets/pokehaiti.jpg'
    },
    {
      categoria: 'poke',
      nome: 'Poke Vietnã (G)',
      descricao: 'Arroz japonês, camarão empanado, cenoura ralada, tomate cereja, sunomono, cream cheese, chips de mandioquinha...',
      serve: '1 pessoa',
      preco: '57,90',
      imagem: 'assets/pokevietna.jpg'
    },

    // TEMAKI
    {
      categoria: 'temaki',
      nome: 'Temaki Índia',
      descricao: 'Cone de alga recheado com arroz japonês, salmão fresco e cebolinha.',
      serve: '1 pessoa',
      preco: '28,90',
      imagem: 'assets/temakiindia.jpg'
    },
    {
      categoria: 'temaki',
      nome: 'Temaki Bali',
      descricao: 'Cone de alga recheado com arroz japonês, pele de salmão grelhada e molho tarê.',
      serve: '1 pessoa',
      preco: '26,90',
      imagem: 'assets/temakibali.jpg'
    },
    {
      categoria: 'temaki',
      nome: 'Temaki Congo',
      descricao: 'Cone de alga recheado com arroz japonês, kani, manga e gergelim.',
      serve: '1 pessoa',
      preco: '25,90',
      imagem: 'assets/temakicongo.jpg'
    },
    {
      categoria: 'temaki',
      nome: 'Temaki Etiópia',
      descricao: 'Cone de alga recheado com arroz japonês, camarão empanado e cream cheese.',
      serve: '1 pessoa',
      preco: '29,90',
      imagem: 'assets/temakietiopia.jpg'
    },

    // YAKISOBA
    {
      categoria: 'yakisoba',
      nome: 'Yakisoba Tailândia',
      descricao: 'Macarrão oriental com carne bovina, frango, legumes frescos e molho especial.',
      serve: '1 pessoa',
      preco: '32,90',
      imagem: 'assets/yakisobatailandia.jpg'
    },
    {
      categoria: 'yakisoba',
      nome: 'Yakisoba Cuba',
      descricao: 'Macarrão oriental com frango grelhado, legumes frescos e molho yakisoba.',
      serve: '1 pessoa',
      preco: '30,90',
      imagem: 'assets/yakisobacuba.jpg'
    },
    {
      categoria: 'yakisoba',
      nome: 'Yakisoba Bangladesh',
      descricao: 'Macarrão oriental com legumes frescos, cogumelos e molho especial.',
      serve: '1 pessoa',
      preco: '29,90',
      imagem: 'assets/yakisobabangladesh.jpg'
    },
    {
      categoria: 'yakisoba',
      nome: 'Yakisoba Finlândia',
      descricao: 'Macarrão oriental com camarão, legumes frescos e molho yakisoba.',
      serve: '1 pessoa',
      preco: '36,90',
      imagem: 'assets/yakisobafinlandia.jpg'
    }
  ];

  constructor(private elRef: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Escuta o scroll para destacar a categoria
    const content = document.getElementById('main-content');
    if (content) {
      content.addEventListener('scroll', () => this.onScroll());
    }
  }

  itensPorCategoria(cat: string) {
    return this.itens.filter(i => i.categoria === cat);
  }

  scrollToCategoria(catId: string) {
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onScroll() {
    // Pega a posição de cada categoria e destaca a correta
    let found = this.categorias[0].id;
    for (const cat of this.categorias) {
      const el = document.getElementById(cat.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Ajuste o valor 120 conforme a altura do seu header
        if (rect.top < 130) {
          found = cat.id;
        }
      }
    }
    this.categoriaEmFoco = found;
  }
}

