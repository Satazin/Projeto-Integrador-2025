import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenu, IonMenuButton, IonApp, IonItem, IonList, IonLabel, IonButton, IonFooter, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonRouterOutlet, IonFooter, IonButton, IonLabel, IonList, IonItem, IonApp, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonMenu, IonMenuButton],
})
export class HomePage {
  constructor() {}
}
