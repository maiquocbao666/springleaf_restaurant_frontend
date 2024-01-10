import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveryOrderHistoryComponent } from './admin-delivery-order-history.component';

describe('AdminDeliveryOrderHistoryComponent', () => {
  let component: AdminDeliveryOrderHistoryComponent;
  let fixture: ComponentFixture<AdminDeliveryOrderHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDeliveryOrderHistoryComponent]
    });
    fixture = TestBed.createComponent(AdminDeliveryOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
