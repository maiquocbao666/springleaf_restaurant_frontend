import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCombosComponent } from './admin-combos.component';

describe('AdminCombosComponent', () => {
  let component: AdminCombosComponent;
  let fixture: ComponentFixture<AdminCombosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCombosComponent]
    });
    fixture = TestBed.createComponent(AdminCombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
