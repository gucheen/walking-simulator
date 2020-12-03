import { TestBed } from '@angular/core/testing';

import { KmlService } from './kml.service';

describe('KmlService', () => {
  let service: KmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
