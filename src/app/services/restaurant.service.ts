import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    private restaurantsUrl = 'restaurants';
    private restaurantUrl = 'restaurant';
    private restaurantsCacheSubject = new BehaviorSubject<Restaurant[]>([]);
    restaurantsCache$ = this.restaurantsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get restaurantsCache(): Restaurant[] {
        return this.restaurantsCacheSubject.value;
    }

    set restaurantsCache(value: Restaurant[]) {
        this.restaurantsCacheSubject.next(value);
    }

    private updateCache(updatedRestaurant: Restaurant): void {
        const index = this.restaurantsCache.findIndex(restaurant => restaurant.restaurantId === updatedRestaurant.restaurantId);
        if (index !== -1) {
            const updatedCache = [...this.restaurantsCache];
            updatedCache[index] = updatedRestaurant;
            this.restaurantsCache = updatedCache;
        }
    }

    getRestaurants(): Observable<Restaurant[]> {

        if (this.restaurantsCache.length > 0) {
            return of(this.restaurantsCache);
        }

        const restaurantsObservable = this.apiService.request<Restaurant[]>('get', this.restaurantsUrl);

        restaurantsObservable.subscribe(data => {
            this.restaurantsCache = data;
        });

        return restaurantsObservable;
    }

    getRestaurantById(id: number): Observable<Restaurant | null> {

        if (!id) {
            return of(null);
        }

        if (!this.restaurantsCache.length) {

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

    private isRestaurantNameInCache(name: string): boolean {
        return !!this.restaurantsCache?.find(restaurant => restaurant.restaurantName.toLowerCase() === name.toLowerCase());
    }

    addRestaurant(newRestaurant: Restaurant): Observable<Restaurant> {

        if (this.isRestaurantNameInCache(newRestaurant.restaurantName)) {
            return of();
        }

        return this.apiService.request<Restaurant>('post', this.restaurantUrl, newRestaurant).pipe(
            tap((addedRestaurant: Restaurant) => {
                this.restaurantsCache = [...this.restaurantsCache, addedRestaurant];
            })
        );
    }

    updateRestaurant(updatedRestaurant: Restaurant): Observable<any> {

        if (this.isRestaurantNameInCache(updatedRestaurant.restaurantName)) {
            return of();
        }

        const url = `${this.restaurantUrl}/${updatedRestaurant.restaurantId}`;

        return this.apiService.request('put', url, updatedRestaurant).pipe(
            tap(() => {
                this.updateCache(updatedRestaurant);
            })
        );
    }

    deleteRestaurant(id: number): Observable<any> {

        const url = `${this.restaurantUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.restaurantsCache.filter(restaurant => restaurant.restaurantId !== id);
                this.restaurantsCache = updatedCache;
            })
        );

    }

    updateRestaurantCache(updatedRestaurant: Restaurant): void {
        const index = this.restaurantsCache.findIndex(restaurant => restaurant.restaurantId === updatedRestaurant.restaurantId);

        if (index !== -1) {
            this.restaurantsCache[index] = updatedRestaurant;
        }
    }
}