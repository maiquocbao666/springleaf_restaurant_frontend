import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';


@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    private restaurantsUrl = 'restaurantsUrl';
    private restaurantUrl = 'restaurantUrl';
    restaurantsCache!: Restaurant[];
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

    addRestaurant(newRestaurant: Restaurant): Observable<Restaurant> {

        return this.apiService.request<Restaurant>('post', this.restaurantUrl, newRestaurant).pipe(

            tap((addedRestaurant: Restaurant) => {

                this.restaurantsCache.push(addedRestaurant);
                localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));

            })

        );

    }

    updateRestaurant(updatedrestaurant: Restaurant): Observable<any> {

        const url = `${this.restaurantUrl}/${updatedrestaurant.restaurantId}`;

        return this.apiService.request('put', url, updatedrestaurant).pipe(

            tap(() => {

                const index = this.restaurantsCache!.findIndex(restaurant => restaurant.restaurantId === updatedrestaurant.restaurantId);

                if (index !== -1) {

                    this.restaurantsCache![index] = updatedrestaurant;
                    localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));

                }

            })

        );

    }

    deleteRestaurant(id: number): Observable<any> {

        const url = `${this.restaurantUrl}/${id}`;
    
        return this.apiService.request('delete', url).pipe(
    
            tap(() => {
    
                const index = this.restaurantsCache.findIndex(restaurant => restaurant.restaurantId === id);
    
                if (index !== -1) {
    
                    this.restaurantsCache.splice(index, 1);
                    localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));
    
                }
    
            })
        );
    
    }
    

}