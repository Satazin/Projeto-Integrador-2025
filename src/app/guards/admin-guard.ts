import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLogged() && this.authService.isAdmin()) {
      return true; // pode acessar
    } else {
      this.router.navigate(['/adm-login']); // volta pro login
      return false;
    }
  }
}
