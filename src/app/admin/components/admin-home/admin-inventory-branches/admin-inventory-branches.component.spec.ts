import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoryBranchesComponent } from './admin-inventory-branches.component';

describe('AdminInventoryBranchesComponent', () => {
  let component: AdminInventoryBranchesComponent;
  let fixture: ComponentFixture<AdminInventoryBranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoryBranchesComponent]
    });
    fixture = TestBed.createComponent(AdminInventoryBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
