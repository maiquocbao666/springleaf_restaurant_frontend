import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuItemIngredientDetailComponent } from './admin-menu-item-ingredient-detail.component';

describe('AdminMenuItemIngredientDetailComponent', () => {
  let component: AdminMenuItemIngredientDetailComponent;
  let fixture: ComponentFixture<AdminMenuItemIngredientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMenuItemIngredientDetailComponent]
    });
    fixture = TestBed.createComponent(AdminMenuItemIngredientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
