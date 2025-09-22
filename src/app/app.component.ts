import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
<<<<<<< HEAD
import { cartOutline, pin, create,star} from 'ionicons/icons';
=======
import { cartOutline, pin, create, trashOutline, personCircleOutline} from 'ionicons/icons';
>>>>>>> 1218c7761a8a733ef132a42b152a9c653514672c



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
<<<<<<< HEAD
      create,
      star
=======
      create, 
      trashOutline,
      personCircleOutline
>>>>>>> 1218c7761a8a733ef132a42b152a9c653514672c
    });
  }
}
