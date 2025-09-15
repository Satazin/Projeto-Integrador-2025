import { TestBed } from '@angular/core/testing';

import { PontosRecom } from './pontos-recom';

describe('PontosRecom', () => {
  let service: PontosRecom;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PontosRecom);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
