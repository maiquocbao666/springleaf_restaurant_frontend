import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantTablesComponent } from './admin-restaurant-tables.component';

describe('AdminRestaurantTablesComponent', () => {
  let component: AdminRestaurantTablesComponent;
  let fixture: ComponentFixture<AdminRestaurantTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRestaurantTablesComponent]
    });
    fixture = TestBed.createComponent(AdminRestaurantTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
