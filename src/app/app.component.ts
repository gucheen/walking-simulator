import { Component, OnInit } from '@angular/core';
import '@amap/amap-jsapi-types';
import { KmlService } from './kml.service';

export interface GEOJSON {
  type: string;
  features: {
    geometry: {
      coordinates: number[]
      type: 'Point'|'LineString'
    }
    properties: {
      name: string
      styleHash: string
      styleUrl: string
      timestamp: string
      stroke: string
      'stroke-width': number
      'stroke-opacity': number
    }
    type: string
  }[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'walking-simulator';
  map: AMap.Map;

  constructor(
    private kml: KmlService,
  ) {
  }

  renderKml({ geojson }: { geojson: GEOJSON }): void {
    const linesGeojson = geojson.features
      .filter(feature => feature.geometry.type === 'LineString');
    let count = linesGeojson.length;
    linesGeojson.forEach(feature => {
        AMap.convertFrom(feature.geometry.coordinates, 'gps', (status, result) => {
          count--;
          if (result.info === 'ok') {
            const lnglats = result.locations;
            if (feature.geometry.type === 'Point') {
              const marker = new AMap.Marker({
                position: [lnglats[0].lng, lnglats[0].lat],
              });
              this.map.add(marker);
            } else if (feature.geometry.type === 'LineString') {
              const line = new AMap.Polyline({
                path: lnglats.map(p => [p.lng, p.lat]),
                strokeColor: feature.properties.stroke,
                strokeWeight: feature.properties['stroke-width'],
                strokeOpacity: feature.properties['stroke-opacity'],
              });
              this.map.add(line);
            }
            if (count === 0) {
              this.map.setFitView(null);
            }
          }
        });
    });
  }

  ngOnInit(): void {
    this.map = new AMap.Map('map', {
      mapStyle: 'amap://styles/whitesmoke',
      features: ['bg', 'road'],
    });
    this.kml.getKml().subscribe(
      (result) => {
        this.renderKml({ geojson: result });
      },
      (error) => {
        console.error(error);
      },
    );
  }
}
