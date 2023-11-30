import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderThresholdsComponent } from './admin-order-thresholds.component';

describe('AdminOrderThresholdComponent', () => {
  let component: AdminOrderThresholdsComponent;
  let fixture: ComponentFixture<AdminOrderThresholdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderThresholdsComponent]
    });
    fixture = TestBed.createComponent(AdminOrderThresholdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
