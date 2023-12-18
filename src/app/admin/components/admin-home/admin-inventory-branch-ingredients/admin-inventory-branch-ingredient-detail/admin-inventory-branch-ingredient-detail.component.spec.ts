import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoryBranchIngredientDetailComponent } from './admin-inventory-branch-ingredient-detail.component';

describe('AdminInventoryBranchIngredientDetailComponent', () => {
  let component: AdminInventoryBranchIngredientDetailComponent;
  let fixture: ComponentFixture<AdminInventoryBranchIngredientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoryBranchIngredientDetailComponent]
    });
    fixture = TestBed.createComponent(AdminInventoryBranchIngredientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
