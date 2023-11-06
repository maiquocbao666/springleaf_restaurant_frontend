import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTableStatusesComponent } from './admin-table-statuses.component';

describe('AdminTableStatusesComponent', () => {
  let component: AdminTableStatusesComponent;
  let fixture: ComponentFixture<AdminTableStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTableStatusesComponent]
    });
    fixture = TestBed.createComponent(AdminTableStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
