import { Favorite } from './../interfaces/favorite';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class FavoriteService {

    private favoritesUrl = 'favorites'; // URL to web api, không cần thêm base URL
    favoritesCache!: Favorite[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getFavorites(): Observable<Favorite[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.favoritesCache) {
            console.log("Có favorites cache");
            return of(this.favoritesCache);
        }

        const favoritesObservable = this.apiService.request<Favorite[]>('get', this.favoritesUrl);

        // Cache the categories observable
        favoritesObservable.subscribe(data => {
            this.favoritesCache = data; // Store the fetched data in the cache
        });

        return favoritesObservable;
    }



}