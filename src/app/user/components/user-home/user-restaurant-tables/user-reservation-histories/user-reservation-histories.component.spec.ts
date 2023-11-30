import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReservationHistoriesComponent } from './user-reservation-histories.component';

describe('UserReservationHistoriesComponent', () => {
  let component: UserReservationHistoriesComponent;
  let fixture: ComponentFixture<UserReservationHistoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserReservationHistoriesComponent]
    });
    fixture = TestBed.createComponent(UserReservationHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
