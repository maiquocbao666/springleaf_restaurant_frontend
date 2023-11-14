import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGoodsReceiptsComponent } from './admin-goods-receipts.component';

describe('AdminGoodsReceiptsComponent', () => {
  let component: AdminGoodsReceiptsComponent;
  let fixture: ComponentFixture<AdminGoodsReceiptsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGoodsReceiptsComponent]
    });
    fixture = TestBed.createComponent(AdminGoodsReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
