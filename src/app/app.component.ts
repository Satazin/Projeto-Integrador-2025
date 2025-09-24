import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, pin, create, trashOutline,timeOutline , personCircleOutline, person, star, logoWhatsapp, logoInstagram, logoFacebook, shareSocialOutline, informationCircle, informationCircleOutline, radioButtonOn, bicycleOutline, checkmarkCircleOutline } from 'ionicons/icons';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
        addIcons({
      cartOutline,
      pin,
      create, 
      trashOutline,
      personCircleOutline,
      person,
      timeOutline,
      star,
      logoWhatsapp,
      logoInstagram,
      logoFacebook,
      shareSocialOutline,
      informationCircleOutline,
      radioButtonOn,
      bicycleOutline,
      checkmarkCircleOutline,
    });
  }
}
