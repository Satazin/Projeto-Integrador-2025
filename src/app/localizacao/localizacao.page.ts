import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environments } from 'src/environments/environment';
import { EnderecoTransferService } from '../services/endereco-transfer';
declare const google: any;

@Component({
  selector: 'app-localizacao',
  templateUrl: './localizacao.page.html',
  styleUrls: ['./localizacao.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LocalizacaoPage implements OnInit, AfterViewInit {
  @ViewChild('map', { static: true }) mapRef!: ElementRef;

  private googleMapInstance: any;
  private currentMarker: any;
  private geocoder: any;

  public selectedAddress: string | null = null;
  public isWeb: boolean = false;

  public initialCenter = { lat: -28.68113, lng: -49.37890 };

  constructor(
    private router: Router,
    private platform: Platform,
    private enderecoTransfer: EnderecoTransferService
  ) { }

  ngOnInit() {
    this.isWeb = this.platform.is('desktop') || this.platform.is('mobileweb');
  }

  ngAfterViewInit() {
    if (this.isWeb) {
      this.loadGoogleMapsScript().then(() => {
        this.initializeGoogleMapsJS();
      });
    } else {
      //Lógica Nativa se precisar compilar para celular
      console.warn('Rodando em ambiente nativo. O código de mapa nativo deve ser implementado aqui.');
    }
  }

  // Carrega o script da API usando a chave do environments
  private loadGoogleMapsScript(): Promise<void> {
    if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environments.mapsKey}&libraries=places`;
      script.onload = () => resolve();
      script.onerror = () => {
        console.error('Erro ao carregar o script do Google Maps.');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // INICIALIZAÇÃO DO MAPA JS SDK com @ts-ignore para evitar problemas de tipagem
  async initializeGoogleMapsJS() {
    try {
      // @ts-ignore
      const mapOptions: google.maps.MapOptions = {
        center: this.initialCenter,
        zoom: 14,
        disableDefaultUI: false,
        clickableIcons: false
      };

      // @ts-ignore
      this.googleMapInstance = new google.maps.Map(
        this.mapRef.nativeElement,
        mapOptions
      );

      // @ts-ignore
      this.geocoder = new google.maps.Geocoder();

      // @ts-ignore
      this.googleMapInstance.addListener('click', (event: any) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          this.handleMapClick(lat, lng);
        }
      });

      // Carregar a localização inicial
      this.handleMapClick(this.initialCenter.lat, this.initialCenter.lng);


    } catch (e) {
      console.error('Erro ao inicializar o mapa JS SDK:', e);
    }
  }

  async handleMapClick(lat: number, lng: number) {
    // @ts-ignore
    const position: google.maps.LatLngLiteral = { lat, lng };
    this.selectedAddress = null;

    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }

    // @ts-ignore
    this.currentMarker = new google.maps.Marker({
      position: position,
      map: this.googleMapInstance,
      title: 'Local Selecionado'
    });

    // @ts-ignore
    this.geocoder.geocode({ 'location': position }, (results: any, status: any) => {
      // @ts-ignore
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.selectedAddress = results[0].formatted_address;

        this.googleMapInstance.setCenter(position);
        this.googleMapInstance.setZoom(18);

      } else {
        console.error('Geocoder falhou:', status);
        window.alert('Não foi possível obter um endereço válido para este ponto.');
        this.selectedAddress = 'Local sem endereço formatado.';
      }
    });
  }

  confirmAddress() {
    if (!this.selectedAddress) return;
    this.enderecoTransfer.setEndereco(this.selectedAddress);
    this.router.navigate(['/perfil']);
  }
}