import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoryBranchDetailComponent } from './admin-inventory-branch-detail.component';

describe('AdminInventoryBranchDetailComponent', () => {
  let component: AdminInventoryBranchDetailComponent;
  let fixture: ComponentFixture<AdminInventoryBranchDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoryBranchDetailComponent]
    });
    fixture = TestBed.createComponent(AdminInventoryBranchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
