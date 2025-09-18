import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { environments } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.page.html',
  styleUrls: ['./localizacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocalizacaoPage implements OnInit {

  constructor() { }

  @ViewChild('map') mapRef?: ElementRef;
  newMap?: GoogleMap;

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getGeolocalizacao();
  }

  async getGeolocalizacao() {
  const currentGeoLocalition = async () => {
    const localition = await Geolocation.getCurrentPosition();

    const novaLatitude = localition.coords.latitude;
    const novaLongitude = localition.coords.longitude;

    if (!this.mapRef) {
      console.error('mapRef is undefined');
      return;
    }
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: environments.mapsKey,
      forceCreate: true,
      config: {
        center: {
          lat: novaLatitude,
          lng: novaLongitude,
        },
        zoom: 8,
      },
    });
  };
  currentGeoLocalition();
}

}
