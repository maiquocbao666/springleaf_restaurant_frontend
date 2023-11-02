import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIngredientDetailComponent } from './admin-ingredient-detail.component';

describe('AdminIngredientDetailComponent', () => {
  let component: AdminIngredientDetailComponent;
  let fixture: ComponentFixture<AdminIngredientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminIngredientDetailComponent]
    });
    fixture = TestBed.createComponent(AdminIngredientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
