import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComboDetailsComponent } from './admin-combo-details.component';

describe('AdminComboDetailComponent', () => {
  let component: AdminComboDetailsComponent;
  let fixture: ComponentFixture<AdminComboDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComboDetailsComponent]
    });
    fixture = TestBed.createComponent(AdminComboDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
