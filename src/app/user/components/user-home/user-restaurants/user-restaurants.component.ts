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
  restaurantsUrl = 'restaurants';

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService.gets();
    this.restaurantService.cache$
      .subscribe(restaurants => {
        this.restaurantService.gets();
        this.restaurants = JSON.parse(localStorage.getItem(this.restaurantsUrl) || 'null')
      });
  }
}
