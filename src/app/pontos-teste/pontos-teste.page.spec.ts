import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PontosTestePage } from './pontos-teste.page';

describe('PontosTestePage', () => {
  let component: PontosTestePage;
  let fixture: ComponentFixture<PontosTestePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PontosTestePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
