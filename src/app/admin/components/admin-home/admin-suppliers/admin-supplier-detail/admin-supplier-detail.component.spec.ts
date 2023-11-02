import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSupplierDetailComponent } from './admin-supplier-detail.component';

describe('AdminSupplierDetailComponent', () => {
  let component: AdminSupplierDetailComponent;
  let fixture: ComponentFixture<AdminSupplierDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSupplierDetailComponent]
    });
    fixture = TestBed.createComponent(AdminSupplierDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
