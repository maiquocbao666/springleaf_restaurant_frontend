import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveryOrderComponent } from './admin-delivery-order.component';

describe('AdminDeliveryOrderComponent', () => {
  let component: AdminDeliveryOrderComponent;
  let fixture: ComponentFixture<AdminDeliveryOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDeliveryOrderComponent]
    });
    fixture = TestBed.createComponent(AdminDeliveryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
