import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantDiagramComponent } from './admin-restaurant-diagram.component';

describe('AdminRestaurantDiagramComponent', () => {
  let component: AdminRestaurantDiagramComponent;
  let fixture: ComponentFixture<AdminRestaurantDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRestaurantDiagramComponent]
    });
    fixture = TestBed.createComponent(AdminRestaurantDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
