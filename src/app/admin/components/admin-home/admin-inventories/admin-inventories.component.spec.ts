import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInventoriesComponent } from './admin-inventories.component';

describe('AdminInventorisComponent', () => {
  let component: AdminInventoriesComponent;
  let fixture: ComponentFixture<AdminInventoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminInventoriesComponent]
    });
    fixture = TestBed.createComponent(AdminInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
