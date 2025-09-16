import { ComponentFixture, TestBed } from '@angular/core/testing';
import { carrinho } from './carrinho.page';

describe('CarrinhoPage', () => {
  let component: carrinho;
  let fixture: ComponentFixture<carrinho>;

  beforeEach(() => {
    fixture = TestBed.createComponent(carrinho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
