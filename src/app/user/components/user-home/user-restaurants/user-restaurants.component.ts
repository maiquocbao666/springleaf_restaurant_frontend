import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-user-restaurant',
  templateUrl: './user-restaurants.component.html',
  styleUrls: ['./user-restaurants.component.css']
})
export class UserRestaurantsComponent {
  restaurants: Restaurant[] = [];

  constructor(private restaurantsService: RestaurantService, private route: ActivatedRoute) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
  }

  ngOnInit(): void {
    this.getrestaurants();
  }

  getrestaurants(): void {
    this.restaurantsService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }
}
