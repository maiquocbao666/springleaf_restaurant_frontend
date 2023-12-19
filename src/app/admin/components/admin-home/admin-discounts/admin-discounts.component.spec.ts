import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDiscountsComponent } from './admin-discounts.component';

describe('AdminDiscountsComponent', () => {
  let component: AdminDiscountsComponent;
  let fixture: ComponentFixture<AdminDiscountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDiscountsComponent]
    });
    fixture = TestBed.createComponent(AdminDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
