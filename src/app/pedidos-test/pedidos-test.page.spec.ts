import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosTestPage } from './pedidos-test.page';

describe('PedidosTestPage', () => {
  let component: PedidosTestPage;
  let fixture: ComponentFixture<PedidosTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
