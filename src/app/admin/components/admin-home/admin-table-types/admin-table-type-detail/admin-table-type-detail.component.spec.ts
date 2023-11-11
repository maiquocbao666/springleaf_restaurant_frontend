import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTableTypeDetailComponent } from './admin-table-type-detail.component';

describe('AdminTableTypeDetailComponent', () => {
  let component: AdminTableTypeDetailComponent;
  let fixture: ComponentFixture<AdminTableTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTableTypeDetailComponent]
    });
    fixture = TestBed.createComponent(AdminTableTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
