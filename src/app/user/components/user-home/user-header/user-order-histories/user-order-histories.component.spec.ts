import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderHistoriesComponent } from './user-order-histories.component';

describe('UserOrderHistoriesComponent', () => {
  let component: UserOrderHistoriesComponent;
  let fixture: ComponentFixture<UserOrderHistoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOrderHistoriesComponent]
    });
    fixture = TestBed.createComponent(UserOrderHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
