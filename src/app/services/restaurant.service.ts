import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';


@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    private restaurantsUrl = 'restaurants';
    private restaurantUrl = 'restaurant';
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

    getRestaurantById(id: number): Observable<Restaurant | null> {

        if (!id) {
            return of(null);
        }

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

    private isRestaurantNameInCache(name: string): boolean {
        const isTrue = !!this.restaurantsCache?.find(restaurant => restaurant.restaurantName === name);
        if (isTrue) {
            console.log('Nhà hàng này đã tồn tại trong cache.');
            return isTrue;
        } else {
            return isTrue;
        }

    }

    addRestaurant(newRestaurant: Restaurant): Observable<Restaurant> {

        if (this.isRestaurantNameInCache(newRestaurant.restaurantName)) {
            // Nếu đã có nhà hàng có cùng tên, trả về Observable với giá trị hiện tại
            return of();
        }

        // Nếu không có nhà hàng cùng tên trong cache, tiếp tục thêm nhà hàng mới
        return this.apiService.request<Restaurant>('post', this.restaurantUrl, newRestaurant).pipe(
            tap((addedRestaurant: Restaurant) => {
                this.restaurantsCache.push(addedRestaurant);
                localStorage.setItem(this.restaurantsUrl, JSON.stringify(this.restaurantsCache));
            })
        );
    }

    updateRestaurant(updatedRestaurant: Restaurant): Observable<any> {

        if (this.isRestaurantNameInCache(updatedRestaurant.restaurantName)) {
            // Nếu đã có nhà hàng có cùng tên, trả về Observable với giá trị hiện tại
            return of();
        }

        const url = `${this.restaurantUrl}/${updatedRestaurant.restaurantId}`;

        return this.apiService.request('put', url, updatedRestaurant).pipe(

            tap(() => {

                const index = this.restaurantsCache!.findIndex(restaurant => restaurant.restaurantId === updatedRestaurant.restaurantId);

                if (index !== -1) {

                    this.restaurantsCache![index] = updatedRestaurant;
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

    updateRestaurantCache(updatedRestaurant: Restaurant): void {
        if (this.restaurantsCache) {
            const index = this.restaurantsCache.findIndex(restaurant => restaurant.restaurantId === updatedRestaurant.restaurantId);

            if (index !== -1) {
                this.restaurantsCache[index] = updatedRestaurant;
            }
        }
    }


}