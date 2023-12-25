import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRestaurantComponent } from './location-restaurant.component';

describe('LocationRestaurantComponent', () => {
  let component: LocationRestaurantComponent;
  let fixture: ComponentFixture<LocationRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationRestaurantComponent]
    });
    fixture = TestBed.createComponent(LocationRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
