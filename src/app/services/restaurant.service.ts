import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Restaurant } from '../interfaces/restaurant';


@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    private restaurantsUrl = 'restaurants'; // URL to web api, không cần thêm base URL
    restaurantsCache!: Restaurant[]; // Cache for categories
    private restaurantUrl = 'restaurant';
    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getRestaurants(): Observable<Restaurant[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.restaurantsCache) {
            return of(this.restaurantsCache);
        }

        const restaurantsObservable = this.apiService.request<Restaurant[]>('get', this.restaurantsUrl);

        // Cache the categories observable
        restaurantsObservable.subscribe(data => {
            this.restaurantsCache = data; // Store the fetched data in the cache
        });

        return restaurantsObservable;
    }
    // Lấy tên theo ID
    getRestaurantById(id: number): Observable<Restaurant> {
        // Check if categoriesCache is null or empty
        if (!this.restaurantsCache) {
            // Fetch the data from the API if cache is empty
            this.getRestaurants();
        }

        const restaurantFromCache = this.restaurantsCache.find(restaurant => restaurant.restaurantId === id);

        if (restaurantFromCache) {
            // If found in cache, return it as an observable
            return of(restaurantFromCache);
        } else {
            // If not found in cache, fetch it from the API
            const url = `${this.restaurantUrl}/${id}`;
            return this.apiService.request<Restaurant>('get', url);
        }
    }


}