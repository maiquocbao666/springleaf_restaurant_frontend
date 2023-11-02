import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInventoryBranchesComponent } from './user-inventory-branches.component';

describe('UserInventoryBranchesComponent', () => {
  let component: UserInventoryBranchesComponent;
  let fixture: ComponentFixture<UserInventoryBranchesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserInventoryBranchesComponent]
    });
    fixture = TestBed.createComponent(UserInventoryBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
