import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMergeTablesComponent } from './admin-merge-tables.component';

describe('AdminMergeTablesComponent', () => {
  let component: AdminMergeTablesComponent;
  let fixture: ComponentFixture<AdminMergeTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMergeTablesComponent]
    });
    fixture = TestBed.createComponent(AdminMergeTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
