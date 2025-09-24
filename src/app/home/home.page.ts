import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'; // Importa o environment
import { AuthService } from '../services/auth'; // Importa o AuthService

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, RouterLink],
})
export class HomePage {
  private auth = getAuth(initializeApp(environment.firebaseConfig)); // Inicializa o Firebase com as configurações do environment

  constructor(private router: Router, private authService: AuthService) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Verifica se o email do usuário logado é o do admin
        if (user.email === this.authService.getAdminEmail()) {
          this.router.navigate(['/pedidos-test']);
        } else {
          this.router.navigate(['/pedidos']);
        }
      }
      // Se user for null, fica na Home/Login
    });
  }
}