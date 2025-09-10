import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';



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
  @ViewChild('categoriasMenu', { static: false }) categoriasMenu!: ElementRef;

  categorias = [
    { id: 'poke', nome: 'POKE' },
    { id: 'temaki', nome: 'TEMAKI' },
    { id: 'yakisoba', nome: 'YAKISOBA' },
    { id: 'sushi', nome: 'SUSHI' },
    { id: 'bebidas', nome: 'BEBIDAS' },
    { id: 'niguiris', nome: 'NIGUIRIS' },
    { id: 'hots', nome: 'PORÇÕES HOT' },
    { id: 'uramakis', nome: 'URAMAKIS' },
    { id: 'acompanhamentos', nome: 'ACOMPANHAMENTOS' },
    { id: 'combos', nome: 'COMBOS' }
  ];


  

  itens = [
    // POKE
    { categoria: 'poke', id: '1', nome: 'Poke Nepal (G)', descricao: 'Arroz japonês ou mix de folhas, salmão furai, cream cheese, cebola roxa, tomate cereja, mix de gergelim...', serve: '1 pessoa', preco: '55,91', imagem: 'assets/pokenepal.jpg' },
    { categoria: 'poke', id: '2', nome: 'Poke Palau (G)', descricao: 'Arroz japonês ou mix de folhas, barriga de salmão selado, azeite trufado, tomate cereja, chips de banana...', serve: '1 pessoa', preco: '57,90', imagem: 'assets/pokepalau.jpg' },
    { categoria: 'poke', id: '3', nome: 'Poke Haiti (G)', descricao: 'Base de arroz gohan, salmão grelhado, molho tarê, sunomono, couve crispy, ervilha wasabi, chips de batata doce...', serve: '1 pessoa', preco: '56,90', imagem: 'assets/pokehaiti.jpg' },
    { categoria: 'poke', id: '4', nome: 'Poke Vietnã (G)', descricao: 'Arroz japonês, camarão empanado, cenoura ralada, tomate cereja, sunomono, cream cheese, chips de mandioquinha...', serve: '1 pessoa', preco: '57,90', imagem: 'assets/pokevietna.jpg' },

    // TEMAKI
    { categoria: 'temaki', id:'5', nome: 'Temaki Índia', descricao: 'Cone de alga recheado com arroz japonês, salmão fresco e cebolinha.', serve: '1 pessoa', preco: '28,90', imagem: 'assets/temakiindia.jpg' },
    { categoria: 'temaki', id: '6', nome: 'Temaki Bali', descricao: 'Cone de alga recheado com arroz japonês, pele de salmão grelhada e molho tarê.', serve: '1 pessoa', preco: '26,90', imagem: 'assets/temakibali.jpg' },
    { categoria: 'temaki', id: '7', nome: 'Temaki Congo', descricao: 'Cone de alga recheado com arroz japonês, kani, manga e gergelim.', serve: '1 pessoa', preco: '25,90', imagem: 'assets/temakicongo.jpg' },
    { categoria: 'temaki', id: '8', nome: 'Temaki Etiópia', descricao: 'Cone de alga recheado com arroz japonês, camarão empanado e cream cheese.', serve: '1 pessoa', preco: '29,90', imagem: 'assets/temakietiopia.jpg' },

    // YAKISOBA
    { categoria: 'yakisoba', id:'9', nome: 'Yakisoba Tailândia', descricao: 'Macarrão oriental com carne bovina, frango, legumes frescos e molho especial.', serve: '1 pessoa', preco: '32,90', imagem: 'assets/yakisobatailandia.jpg' },
    { categoria: 'yakisoba', id:'10', nome: 'Yakisoba Cuba', descricao: 'Macarrão oriental com frango grelhado, legumes frescos e molho yakisoba.', serve: '1 pessoa', preco: '30,90', imagem: 'assets/yakisobacuba.jpg' },
    { categoria: 'yakisoba', id: '11', nome: 'Yakisoba Bangladesh', descricao: 'Macarrão oriental com legumes frescos, cogumelos e molho especial.', serve: '1 pessoa', preco: '29,90', imagem: 'assets/yakisobabangladesh.jpg' },
    { categoria: 'yakisoba', id: '12', nome: 'Yakisoba Finlândia', descricao: 'Macarrão oriental com camarão, legumes frescos e molho yakisoba.', serve: '1 pessoa', preco: '36,90', imagem: 'assets/yakisobafinlandia.jpg' },

    // SUSHI
    { categoria: 'sushi', id:'13', nome: 'Sushi Filipinas', descricao: 'Arroz japonês, peixe fresco, legumes e molho especial.', serve: '1 pessoa', preco: '32,90', imagem: 'assets/sushifilipinas.jpg' },
    { categoria: 'sushi', id:'14', nome: 'Sushi Japão', descricao: 'Arroz japonês, salmão fresco, nori e molho shoyu.', serve: '1 pessoa', preco: '34,90', imagem: 'assets/sushijapao.jpg' },
    { categoria: 'sushi', id:'15', nome: 'Sushi Noruega', descricao: 'Arroz japonês, salmão defumado, cream cheese e cebolinha.', serve: '1 pessoa', preco: '35,90', imagem: 'assets/sushinoruega.jpg' },
    { categoria: 'sushi', id:'16', nome: 'Sushi Brasil', descricao: 'Arroz japonês, peixe branco, manga e molho especial.', serve: '1 pessoa', preco: '33,90', imagem: 'assets/sushibrasil.jpg' },

    // BEBIDAS
    { categoria: 'bebidas', id:'17', nome: 'Refrigerante Lata', descricao: 'Coca-Cola, Guaraná, Fanta ou Sprite.', serve: '350ml', preco: '6,00', imagem: 'assets/refrigerante.jpg' },
    { categoria: 'bebidas', id:'18', nome: 'Água Mineral', descricao: 'Com ou sem gás.', serve: '500ml', preco: '4,00', imagem: 'assets/agua.jpg' },
    { categoria: 'bebidas', id:'19', nome: 'Suco Natural', descricao: 'Laranja, limão ou maracujá.', serve: '300ml', preco: '8,00', imagem: 'assets/suco.jpg' },
    { categoria: 'bebidas', id:'20', nome: 'Cerveja Long Neck', descricao: 'Heineken, Budweiser ou Stella.', serve: '330ml', preco: '10,00', imagem: 'assets/cerveja.jpg' },

    // NIGUIRIS
    { categoria: 'niguiris', id:'21', nome: 'Niguiri Salmão', descricao: 'Bolinho de arroz japonês com fatia de salmão fresco.', serve: '2 unidades', preco: '14,00', imagem: 'assets/niguirisalmao.jpg' },
    { categoria: 'niguiris', id:'22', nome: 'Niguiri Atum', descricao: 'Bolinho de arroz japonês com fatia de atum.', serve: '2 unidades', preco: '15,00', imagem: 'assets/niguiriatum.jpg' },
    { categoria: 'niguiris', id:'23', nome: 'Niguiri Camarão', descricao: 'Bolinho de arroz japonês com camarão.', serve: '2 unidades', preco: '16,00', imagem: 'assets/niguiricamarao.jpg' },
    { categoria: 'niguiris', id:'24', nome: 'Niguiri Skin', descricao: 'Bolinho de arroz japonês com pele de salmão crocante.', serve: '2 unidades', preco: '13,00', imagem: 'assets/niguiriskin.jpg' },

    // PORÇÕES HOT
    { categoria: 'hots', id:'25', nome: 'Hot Philadelphia', descricao: 'Salmão, cream cheese e cebolinha empanados.', serve: '8 unidades', preco: '22,00', imagem: 'assets/hotphiladelphia.jpg' },
    { categoria: 'hots', id:'26', nome: 'Hot Camarão', descricao: 'Camarão, cream cheese e cebolinha empanados.', serve: '8 unidades', preco: '24,00', imagem: 'assets/hotcamarao.jpg' },
    { categoria: 'hots', id:'27', nome: 'Hot Kani', descricao: 'Kani, cream cheese e cebolinha empanados.', serve: '8 unidades', preco: '20,00', imagem: 'assets/hotkani.jpg' },
    { categoria: 'hots', id:'28', nome: 'Hot Skin', descricao: 'Pele de salmão, cream cheese e cebolinha empanados.', serve: '8 unidades', preco: '19,00', imagem: 'assets/hotskin.jpg' },

    // URAMAKIS
    { categoria: 'uramakis', id:'29', nome: 'Uramaki Salmão', descricao: 'Arroz japonês, salmão, nori e gergelim.', serve: '8 unidades', preco: '21,00', imagem: 'assets/uramaki-salmao.jpg' },
    { categoria: 'uramakis', id:'30', nome: 'Uramaki Califórnia', descricao: 'Arroz japonês, kani, manga, nori e gergelim.', serve: '8 unidades', preco: '20,00', imagem: 'assets/uramaki-california.jpg' },
    { categoria: 'uramakis', id:'31', nome: 'Uramaki Atum', descricao: 'Arroz japonês, atum, nori e gergelim.', serve: '8 unidades', preco: '22,00', imagem: 'assets/uramaki-atum.jpg' },
    { categoria: 'uramakis', id:'32', nome: 'Uramaki Skin', descricao: 'Arroz japonês, pele de salmão, nori e gergelim.', serve: '8 unidades', preco: '19,00', imagem: 'assets/uramaki-skin.jpg' },

    // ACOMPANHAMENTOS
    { categoria: 'acompanhamentos', id:'33', nome: 'Sunomono', descricao: 'Pepino agridoce japonês.', serve: 'Porção', preco: '8,00', imagem: 'assets/sunomono.jpg' },
    { categoria: 'acompanhamentos', id:'34', nome: 'Gohan', descricao: 'Arroz japonês.', serve: 'Porção', preco: '7,00', imagem: 'assets/gohan.jpg' },
    { categoria: 'acompanhamentos', id:'35', nome: 'Shimeji', descricao: 'Cogumelos salteados.', serve: 'Porção', preco: '15,00', imagem: 'assets/shimeji.jpg' },
    { categoria: 'acompanhamentos', id:'36', nome: 'Missoshiru', descricao: 'Sopa japonesa de missô.', serve: 'Porção', preco: '9,00', imagem: 'assets/missoshiru.jpg' },

    // COMBOS
    { categoria: 'combos', id:'37', nome: 'Combo Bonsai', descricao: '20 peças variadas de sushi, sashimi e hot.', serve: 'Serve 2 pessoas', preco: '69,90', imagem: 'assets/combo-bonsai.jpg' },
    { categoria: 'combos', id:'38', nome: 'Combo Família', descricao: '40 peças variadas de sushi, sashimi, hot e uramaki.', serve: 'Serve 4 pessoas', preco: '129,90', imagem: 'assets/combo-familia.jpg' },
    { categoria: 'combos', id:'39', nome: 'Combo Light', descricao: '16 peças de sushi e sashimi.', serve: 'Serve 1 pessoa', preco: '49,90', imagem: 'assets/combo-light.jpg' },
    { categoria: 'combos', id:'40', nome: 'Combo Premium', descricao: '30 peças de sushi, sashimi, hot, uramaki e niguiris.', serve: 'Serve 3 pessoas', preco: '99,90', imagem: 'assets/combo-premium.jpg' }
  ];

  constructor(private elRef: ElementRef, private modalCtrl: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const content = document.getElementById('main-content');
    if (content) {
      content.addEventListener('scroll', () => this.onScroll());
    }
  }

  itensPorCategoria(cat: string) {
    return this.itens.filter(i => i.categoria === cat);
  }

  scrollCategorias(direcao: 'esquerda' | 'direita') {
  const el = this.categoriasMenu?.nativeElement;
  if (el) {
    const largura = el.offsetWidth;
    el.scrollBy({ left: direcao === 'direita' ? largura / 2 : -largura / 2, behavior: 'smooth' });
  }
}

  onScroll() {
    let found = this.categorias[0].id;
    for (const cat of this.categorias) {
      const el = document.getElementById(cat.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 130) {
          found = cat.id;
        }
      }
    }
   
  }

  selecionarItem(item: any) {
    // Ação ao clicar no item (abrir detalhes, adicionar ao carrinho, etc)
    console.log('Item selecionado:', item);
  }

  scrollToCategoria(categoriaId: string) {
    const el: HTMLElement | null = document.getElementById(categoriaId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

