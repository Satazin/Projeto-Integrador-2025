import { TestBed } from '@angular/core/testing';

import { EnderecoTransfer } from './endereco-transfer';

describe('EnderecoTransfer', () => {
  let service: EnderecoTransfer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnderecoTransfer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
