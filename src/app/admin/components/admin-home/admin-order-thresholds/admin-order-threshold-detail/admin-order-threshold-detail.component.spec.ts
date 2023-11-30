import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderThresholdDetailComponent } from './admin-order-threshold-detail.component';

describe('AdminOrderThresholdDetailComponent', () => {
  let component: AdminOrderThresholdDetailComponent;
  let fixture: ComponentFixture<AdminOrderThresholdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrderThresholdDetailComponent]
    });
    fixture = TestBed.createComponent(AdminOrderThresholdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
