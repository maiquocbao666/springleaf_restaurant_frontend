import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComboDetailComponent } from './admin-combo-detail.component';

describe('AdminComboDetailComponent', () => {
  let component: AdminComboDetailComponent;
  let fixture: ComponentFixture<AdminComboDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComboDetailComponent]
    });
    fixture = TestBed.createComponent(AdminComboDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
