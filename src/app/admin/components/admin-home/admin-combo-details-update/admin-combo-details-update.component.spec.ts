import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComboDetailsUpdateComponent } from './admin-combo-details-update.component';

describe('AdminComboDetailsUpdateComponent', () => {
  let component: AdminComboDetailsUpdateComponent;
  let fixture: ComponentFixture<AdminComboDetailsUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComboDetailsUpdateComponent]
    });
    fixture = TestBed.createComponent(AdminComboDetailsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
