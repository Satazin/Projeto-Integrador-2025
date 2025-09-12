import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrindesPage } from './brindes.page';

describe('BrindesPage', () => {
  let component: BrindesPage;
  let fixture: ComponentFixture<BrindesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BrindesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
