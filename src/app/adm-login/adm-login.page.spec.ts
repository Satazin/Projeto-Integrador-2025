import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmLoginPage } from './adm-login.page';

describe('AdmLoginPage', () => {
  let component: AdmLoginPage;
  let fixture: ComponentFixture<AdmLoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
