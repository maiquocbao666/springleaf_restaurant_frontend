import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersDetailComponent } from './admin-users-detail.component';

describe('AdminUsersDetailComponent', () => {
  let component: AdminUsersDetailComponent;
  let fixture: ComponentFixture<AdminUsersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUsersDetailComponent]
    });
    fixture = TestBed.createComponent(AdminUsersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
