import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps';
import { environments } from 'src/environments/environment';

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.page.html',
  styleUrls: ['./localizacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LocalizacaoPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: true }) mapRef!: ElementRef;
  private newMap!: GoogleMap;

  // Posição ATUALIZADA com as coordenadas exatas da R. Henrique Lage, 560
  private restaurantPosition = {
    lat: -28.678542900350667,
    lng: -49.37593326306625
  };

  constructor() { }

  ngOnInit() {
    // Não é necessário código de inicialização (Geolocation removido)
  }

  ngAfterViewInit() {
    this.createMap();
  }
  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'restaurant-map',
        element: this.mapRef.nativeElement,
        apiKey: environments.mapsKey,
        config: {
          center: this.restaurantPosition, // Centraliza no ponto fixo
          zoom: 18, // Zoom de alta precisão
        },
      });

      // Adiciona o marcador fixo
      this.addRestaurantMarker(this.restaurantPosition);

    } catch (e) {
      console.error('Erro ao criar o mapa:', e);
    }
  }

  // Função para adicionar o marcador do restaurante
  async addRestaurantMarker(position: { lat: number, lng: number }) {
    await this.newMap.addMarker({
      coordinate: position,
      title: 'Casa Bonsai',
      snippet: 'R. Henrique Lage, 560 - Senac',
    });
  }
}