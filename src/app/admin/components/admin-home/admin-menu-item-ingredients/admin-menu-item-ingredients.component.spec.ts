import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuItemIngredientsComponent } from './admin-menu-item-ingredients.component';

describe('AdminMenuItemIngredientsComponent', () => {
  let component: AdminMenuItemIngredientsComponent;
  let fixture: ComponentFixture<AdminMenuItemIngredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMenuItemIngredientsComponent]
    });
    fixture = TestBed.createComponent(AdminMenuItemIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
