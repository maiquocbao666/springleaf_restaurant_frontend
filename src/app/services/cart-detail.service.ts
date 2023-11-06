import { CartDetail } from '../interfaces/cart-detail';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class CartDetailService {

    private cartDetailsUrl = 'cartDetails';
    private cartDetailUrl = 'cartDetail';
    cartDetailsCache!: CartDetail[];

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

    addCartDetail(newCartDetail: CartDetail): Observable<CartDetail> {

        return this.apiService.request<CartDetail>('post', this.cartDetailsUrl, newCartDetail).pipe(

            tap((addedBill: CartDetail) => {

                this.cartDetailsCache.push(addedBill);
                localStorage.setItem(this.cartDetailsUrl, JSON.stringify(this.cartDetailsCache));

            })

        );

    }

    updateCartDetail(updatedCartDetail: CartDetail): Observable<any> {

        const url = `${this.cartDetailsUrl}/${updatedCartDetail.orderDetailId}`;

        return this.apiService.request('put', url, updatedCartDetail).pipe(

            tap(() => {

                const index = this.cartDetailsCache!.findIndex(cartDetail => cartDetail.orderDetailId === updatedCartDetail.orderDetailId);

                if (index !== -1) {

                    this.cartDetailsCache![index] = updatedCartDetail;
                    localStorage.setItem(this.cartDetailsUrl, JSON.stringify(this.cartDetailsCache));

                }

            })

        );

    }

    deletecartDetail(id: number): Observable<any> {

        const url = `${this.cartDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.cartDetailsCache.findIndex(cartDetail => cartDetail.orderDetailId === id);

                if (index !== -1) {

                    this.cartDetailsCache.splice(index, 1);
                    localStorage.setItem('categories', JSON.stringify(this.cartDetailsCache));

                }

            })
        );

    }

}