import { CartDetail } from '../interfaces/cart-detail';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class CartDetailService {

    private cartDetailsUrl = 'cartDetails';
    cartDetailsCache!: CartDetail[] ;

    constructor(private apiService: ApiService) { } 

    
    getCartDetails(): Observable<CartDetail[]> {
        
        if (this.cartDetailsCache) {

            return of(this.cartDetailsCache);

        }

        const cartDetailsObservable = this.apiService.request<CartDetail[]>('get', this.cartDetailsUrl);

        
        cartDetailsObservable.subscribe(data => {

            this.cartDetailsCache = data; 

        });

        return cartDetailsObservable;
        
    }



}