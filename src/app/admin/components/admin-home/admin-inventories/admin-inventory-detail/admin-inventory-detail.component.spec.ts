import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoryDetailComponent } from './admin-inventory-detail.component';

describe('AdminInventoryDetailComponent', () => {
  let component: AdminInventoryDetailComponent;
  let fixture: ComponentFixture<AdminInventoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoryDetailComponent]
    });
    fixture = TestBed.createComponent(AdminInventoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
