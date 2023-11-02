import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantTableDetailComponent } from './admin-restaurant-table-detail.component';

describe('AdminRestaurantTableDetailComponent', () => {
  let component: AdminRestaurantTableDetailComponent;
  let fixture: ComponentFixture<AdminRestaurantTableDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRestaurantTableDetailComponent]
    });
    fixture = TestBed.createComponent(AdminRestaurantTableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
