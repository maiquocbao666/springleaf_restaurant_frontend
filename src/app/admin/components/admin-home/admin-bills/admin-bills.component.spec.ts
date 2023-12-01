import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBillsComponent } from './admin-bills.component';

describe('AdminBillsComponent', () => {
  let component: AdminBillsComponent;
  let fixture: ComponentFixture<AdminBillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminBillsComponent]
    });
    fixture = TestBed.createComponent(AdminBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
