import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTableStatusDetailComponent } from './admin-table-status-detail.component';

describe('AdminTableStatusDetailComponent', () => {
  let component: AdminTableStatusDetailComponent;
  let fixture: ComponentFixture<AdminTableStatusDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTableStatusDetailComponent]
    });
    fixture = TestBed.createComponent(AdminTableStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
