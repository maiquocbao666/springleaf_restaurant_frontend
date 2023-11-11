import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTableTypesComponent } from './admin-table-types.component';

describe('AdminTableTypesComponent', () => {
  let component: AdminTableTypesComponent;
  let fixture: ComponentFixture<AdminTableTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTableTypesComponent]
    });
    fixture = TestBed.createComponent(AdminTableTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
