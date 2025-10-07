import { TestBed } from '@angular/core/testing';

// Update the import path if the file is named 'carrinho.service.ts'
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  let service: CarrinhoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrinhoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
