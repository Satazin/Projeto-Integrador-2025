// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Importa o serviço de autenticação

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLogged()) {
      console.log('Usuário está logado, acesso permitido pela AuthGuard.');
      return true; // Permite o acesso se o usuário estiver logado
    } else {
      // Se não estiver logado, redireciona para a página de login ou cadastro
      this.router.navigate(['/login']);
      return false; // Bloqueia o acesso à rota
    }
  }
}