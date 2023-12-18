import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiscountDetailComponent } from './admin-discount-detail.component';

describe('AdminDiscountDetailComponent', () => {
  let component: AdminDiscountDetailComponent;
  let fixture: ComponentFixture<AdminDiscountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDiscountDetailComponent]
    });
    fixture = TestBed.createComponent(AdminDiscountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
