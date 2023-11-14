import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReceiptsComponent } from './admin-receipts.component';

describe('AdminReceiptsComponent', () => {
  let component: AdminReceiptsComponent;
  let fixture: ComponentFixture<AdminReceiptsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminReceiptsComponent]
    });
    fixture = TestBed.createComponent(AdminReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
