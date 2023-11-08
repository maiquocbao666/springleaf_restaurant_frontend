import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeliveryDetailComponent } from './admin-delivery-detail.component';

describe('AdminDeliveryDetailComponent', () => {
  let component: AdminDeliveryDetailComponent;
  let fixture: ComponentFixture<AdminDeliveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDeliveryDetailComponent]
    });
    fixture = TestBed.createComponent(AdminDeliveryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
