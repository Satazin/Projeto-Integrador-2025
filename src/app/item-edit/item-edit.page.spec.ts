import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemEditPage } from './item-edit.page';

describe('ItemEditPage', () => {
  let component: ItemEditPage;
  let fixture: ComponentFixture<ItemEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
