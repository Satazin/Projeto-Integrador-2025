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
  },  {
    path: 'localizacao',
    loadComponent: () => import('./localizacao/localizacao.page').then( m => m.LocalizacaoPage)
  },
  {
    path: 'contato',
    loadComponent: () => import('./contato/contato.page').then( m => m.ContatoPage)
  },



];
