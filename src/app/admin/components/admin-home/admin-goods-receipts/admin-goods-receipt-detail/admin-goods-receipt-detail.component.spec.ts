import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGoodsReceiptDetailComponent } from './admin-goods-receipt-detail.component';

describe('AdminGoodsReceiptDetailComponent', () => {
  let component: AdminGoodsReceiptDetailComponent;
  let fixture: ComponentFixture<AdminGoodsReceiptDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGoodsReceiptDetailComponent]
    });
    fixture = TestBed.createComponent(AdminGoodsReceiptDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
