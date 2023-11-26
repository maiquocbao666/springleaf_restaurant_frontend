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

    gets(): Observable<Restaurant[]> {

        if (this.restaurantsCache) {
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

            this.gets();
        }

        const restaurantFromCache = this.restaurantsCache.find(restaurant => restaurant.restaurantId === id);

        if (restaurantFromCache) {

            return of(restaurantFromCache);

        } else {

            const url = `${this.restaurantUrl}/${id}`;
            return this.apiService.request<Restaurant>('get', url);

        }
    }

    private isInCache(name: string, idToExclude: number | null = null): boolean {
        const isInCache = this.restaurantsCache?.some(
            (cache) =>
                cache.restaurantName.toLowerCase() === name.toLowerCase() && cache.restaurantId !== idToExclude
        );

        if (isInCache) {
            console.log("Restaurant này đã có rồi");
        }

        return isInCache || false;
    }

    add(newRestaurant: Restaurant): Observable<Restaurant> {

        if (this.restaurantsCache) {
            if (this.isInCache(newRestaurant.restaurantName)) {
                return of();
            }
        }

        return this.apiService.request<Restaurant>('post', this.restaurantUrl, newRestaurant).pipe(
            tap((addedrestaurant: Restaurant) => {
                this.restaurantsCache = [...this.restaurantsCache, addedrestaurant];
                localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));
            })
        );
    }

    update(updated: Restaurant): Observable<any> {

        if (this.isInCache(updated.restaurantName, updated.restaurantId)) {
            return of();
        }

        const url = `${this.restaurantUrl}/${updated.restaurantId}`;

        return this.apiService.request('put', url, updated).pipe(
            tap(() => {
                const updatedRestaurants = this.restaurantsCache.map((restaurant) =>
                    restaurant.restaurantId === updated.restaurantId ? updated : restaurant
                );
                this.restaurantsCache = updatedRestaurants;
                localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));
            })
        );
    }

    delete(id: number): Observable<any> {

        const url = `${this.restaurantUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.restaurantsCache.filter(restaurant => restaurant.restaurantId !== id);
                this.restaurantsCache = updatedCache;
                localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));
            })
        );

    }

}