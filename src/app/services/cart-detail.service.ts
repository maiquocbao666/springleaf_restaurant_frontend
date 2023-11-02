import { CartDetail } from '../interfaces/cart-detail';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class CartDetailService {

    private cartDetailsUrl = 'cartDetails'; // URL to web api, không cần thêm base URL
    cartDetailsCache!: CartDetail[] ; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getCartDetails(): Observable<CartDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.cartDetailsCache) {
            return of(this.cartDetailsCache);
        }

        const cartDetailsObservable = this.apiService.request<CartDetail[]>('get', this.cartDetailsUrl);

        // Cache the categories observable
        cartDetailsObservable.subscribe(data => {
            this.cartDetailsCache = data; // Store the fetched data in the cache
        });

        return cartDetailsObservable;
    }



}