import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizacaoCadastroPage } from './localizacao-cadastro.page';

describe('LocalizacaoCadastroPage', () => {
  let component: LocalizacaoCadastroPage;
  let fixture: ComponentFixture<LocalizacaoCadastroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizacaoCadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
