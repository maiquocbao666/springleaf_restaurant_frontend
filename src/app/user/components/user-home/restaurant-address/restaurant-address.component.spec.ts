import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantAddressComponent } from './restaurant-address.component';

describe('RestaurantAddressComponent', () => {
  let component: RestaurantAddressComponent;
  let fixture: ComponentFixture<RestaurantAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantAddressComponent]
    });
    fixture = TestBed.createComponent(RestaurantAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
