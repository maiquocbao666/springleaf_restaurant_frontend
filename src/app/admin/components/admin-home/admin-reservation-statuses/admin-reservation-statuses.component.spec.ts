import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationStatusesComponent } from './admin-reservation-statuses.component';

describe('AdminReservationStatusesComponent', () => {
  let component: AdminReservationStatusesComponent;
  let fixture: ComponentFixture<AdminReservationStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReservationStatusesComponent]
    });
    fixture = TestBed.createComponent(AdminReservationStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
