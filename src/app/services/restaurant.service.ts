import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';


@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    private restaurantsUrl = 'restaurants';
    restaurantsCache!: Restaurant[];
    private restaurantUrl = 'restaurant';
    constructor(private apiService: ApiService) { }

   
    getRestaurants(): Observable<Restaurant[]> {
        
        if (this.restaurantsCache) {
            
            return of(this.restaurantsCache);

        }

        const restaurantsObservable = this.apiService.request<Restaurant[]>('get', this.restaurantsUrl);

        
        restaurantsObservable.subscribe(data => {

            this.restaurantsCache = data;

        });

        return restaurantsObservable;

    }
   
    getRestaurantById(id: number): Observable<Restaurant> {
        
        if (!this.restaurantsCache) {
            
            this.getRestaurants();
        }

        const restaurantFromCache = this.restaurantsCache.find(restaurant => restaurant.restaurantId === id);

        if (restaurantFromCache) {
           
            return of(restaurantFromCache);

        } else {
            
            const url = `${this.restaurantUrl}/${id}`;
            return this.apiService.request<Restaurant>('get', url);

        }
    }


}