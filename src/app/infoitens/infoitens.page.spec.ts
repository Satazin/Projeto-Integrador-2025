import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoitensPage } from './infoitens.page';

describe('InfoitensPage', () => {
  let component: InfoitensPage;
  let fixture: ComponentFixture<InfoitensPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoitensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
