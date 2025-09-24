import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PixModalPage } from './pix-modal.page';

describe('PixModalPage', () => {
  let component: PixModalPage;
  let fixture: ComponentFixture<PixModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PixModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
