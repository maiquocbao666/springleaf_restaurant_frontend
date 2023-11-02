import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestaurantTablesComponent } from './user-restaurant-tables.component';

describe('UserTableComponent', () => {
  let component: UserRestaurantTablesComponent;
  let fixture: ComponentFixture<UserRestaurantTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRestaurantTablesComponent]
    });
    fixture = TestBed.createComponent(UserRestaurantTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
