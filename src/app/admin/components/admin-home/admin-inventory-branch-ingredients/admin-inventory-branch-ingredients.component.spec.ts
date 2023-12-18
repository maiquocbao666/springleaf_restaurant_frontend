import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoryBranchIngredientsComponent } from './admin-inventory-branch-ingredients.component';

describe('AdminInventoryBranchIngredientComponent', () => {
  let component: AdminInventoryBranchIngredientsComponent;
  let fixture: ComponentFixture<AdminInventoryBranchIngredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoryBranchIngredientsComponent]
    });
    fixture = TestBed.createComponent(AdminInventoryBranchIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
