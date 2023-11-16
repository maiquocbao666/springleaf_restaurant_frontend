import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestaurantTableInfomationComponent } from './user-restaurant-table-infomation.component';

describe('UserRestaurantTableInfomationComponent', () => {
  let component: UserRestaurantTableInfomationComponent;
  let fixture: ComponentFixture<UserRestaurantTableInfomationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRestaurantTableInfomationComponent]
    });
    fixture = TestBed.createComponent(UserRestaurantTableInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
