import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GerenciarItensComponent } from './gerenciar-itens.component';

describe('GerenciarItensComponent', () => {
  let component: GerenciarItensComponent;
  let fixture: ComponentFixture<GerenciarItensComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GerenciarItensComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarItensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
