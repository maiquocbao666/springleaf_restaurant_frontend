import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReceiptDetailComponent } from './admin-receipt-detail.component';

describe('AdminReceiptDetailComponent', () => {
  let component: AdminReceiptDetailComponent;
  let fixture: ComponentFixture<AdminReceiptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReceiptDetailComponent]
    });
    fixture = TestBed.createComponent(AdminReceiptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
