import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

const iconSantander = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map implements AfterViewInit {
  private map: any;
  private markers: any[] = []; // Alterado para suportar múltiplos pinos

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map', {
      scrollWheelZoom: false,
    }).setView([-23.5505, -46.6333], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('wheel', (e: any) => {
      if (e.originalEvent.ctrlKey) {
        this.map.scrollWheelZoom.enable();
      } else {
        this.map.scrollWheelZoom.disable();
      }
    });
  }

  renderizarPinos(pinos: { lat: number, lon: number, texto: string, isSantander: boolean }[]) {
    // Remove os marcadores antigos
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    if (pinos.length === 0) return;

    // Foca no primeiro pino (o CEP buscado)
    this.map.setView([pinos[0].lat, pinos[0].lon], 18);

    pinos.forEach(pino => {
      const iconToUse = pino.isSantander ? iconSantander : iconDefault;
      
      const newMarker = L.marker([pino.lat, pino.lon], { icon: iconToUse })
        .addTo(this.map)
        .bindPopup(pino.texto);
        
      // Se for o primeiro (seu endereço), abre o popup automaticamente
      if (!pino.isSantander) {
        newMarker.openPopup();
      }

      this.markers.push(newMarker);
    });
  }
}
