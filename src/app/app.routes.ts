import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./pedidos/pedidos.page').then( m => m.PedidosPage)
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./carrinho/carrinho.page').then( m => m.CarrinhoPage)
  },

  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'sobre-nos',
    loadComponent: () => import('./sobre-nos/sobre-nos.page').then( m => m.SobreNosPage)
  },
  {
    path: 'localizacao',
    loadComponent: () => import('./localizacao/localizacao.page').then( m => m.LocalizacaoPage)
  },
  {
    path: 'contato',
    loadComponent: () => import('./contato/contato.page').then( m => m.ContatoPage)
  },
  {
    path: 'infoitens',
    loadComponent: () => import('./infoitens/infoitens.page').then( m => m.InfoitensPage)
  },
  {
    path: 'infoitens/:id',
    loadComponent: () => import('./infoitens/infoitens.page').then(m => m.InfoitensPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'pedidos-test',
    loadComponent: () => import('./pedidos-test/pedidos-test.page').then( m => m.PedidosTestPage)
  },
  {
    path: 'brindes',
    loadComponent: () => import('./brindes/brindes.page').then( m => m.BrindesPage)
  },

  {
    path: 'ponto',
    loadComponent: () => import('./pontos/pontos.component').then(m => m.PontosPage)
  },

  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  
  {
    path: 'itens',
    loadComponent: () => import('./pages/gerenciar-itens/gerenciar-itens.component').then(m => m.GerenciarItensComponent)
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
