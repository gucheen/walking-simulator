import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscribable } from 'rxjs';
import { GEOJSON } from './app.component';

@Injectable({
  providedIn: 'root',
})
export class KmlService {
  kmlUrl = window.geojsonFile;

  constructor(private http: HttpClient) {
  }

  getKml(): Subscribable<GEOJSON> {
    return this.http.get(this.kmlUrl);
  }
}
