import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonIcon, IonTabButton, IonLabel, IonTabBar, IonFooter, IonButton, IonButtons, IonToolbar } from '@ionic/angular/standalone';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importado para usar NgIf
import { addIcons } from 'ionicons';
import {
  cartOutline,
  homeOutline,
  pin,
  create,
  trashOutline,
  timeOutline,
  personCircleOutline,
  person,
  star,
  logoWhatsapp,
  logoInstagram,
  logoFacebook,
  shareSocialOutline,
  informationCircleOutline,
  radioButtonOn,
  bicycleOutline,
  checkmarkCircleOutline,
  copyOutline,
  checkmarkOutline,
  addOutline,
  radioButtonOnOutline
} from 'ionicons/icons';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonButton, IonLabel, IonIcon, IonApp, IonRouterOutlet, RouterLink, CommonModule], 
})
export class AppComponent {
  showFooter = true; // controla se o menu aparece ou não

  constructor(
    private router: Router,
    public authService: AuthService,
    private alertController: AlertController
  ) {
    // registrar ícones
    addIcons({
      cartOutline,
      homeOutline,
      pin,
      create,
      trashOutline,
      timeOutline,
      personCircleOutline,
      person,
      star,
      logoWhatsapp,
      logoInstagram,
      logoFacebook,
      shareSocialOutline,
      radioButtonOn,
      bicycleOutline,
      checkmarkCircleOutline,
      copyOutline,
      checkmarkOutline,
      addOutline,
      informationCircleOutline,
      radioButtonOnOutline,
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        this.showFooter = !(url.includes('/login') || url.includes('/cadastro') || url.includes('/home') || url.includes('/localizacao') || url.includes('/carrinho') );
      });
  }

   async abrirPerfil() {
    const usuarioLogado = this.authService.usuarioLogado;
    if (usuarioLogado) {
      this.router.navigate(['/perfil']);
    } else {
      const alert = await this.alertController.create({
          header: 'Acesso Restrito',
        message: `Voce precisa estar logado para acessar o perfil.`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Logar',
            handler: () => { this.router.navigate(['/login']); },
          },
        ],
      });
      await alert.present();
    }
  }
}