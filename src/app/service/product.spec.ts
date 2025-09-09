import { TestBed } from '@angular/core/testing';

import { Product } from './product';

describe('Product', () => {
  let service: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = {} as Product;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
