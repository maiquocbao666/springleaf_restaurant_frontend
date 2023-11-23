import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CartDetail } from '../interfaces/cart-detail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartDetailService {

  private cartDetailsUrl = 'cartDetails';
  private cartDetailUrl = 'cartDetail';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private cartDetailsCacheSubject = new BehaviorSubject<CartDetail[]>([]);
  cartDetailsCache$ = this.cartDetailsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get cartDetailsCache(): CartDetail[] {
    return this.cartDetailsCacheSubject.value;
  }

  set cartDetailsCache(value: CartDetail[]) {
    this.cartDetailsCacheSubject.next(value);
  }

  getCartDetails(): Observable<CartDetail[]> {
    if (this.cartDetailsCache.length > 0) {
      return of(this.cartDetailsCache);
    }

    const cartDetailsObservable = this.apiService.request<CartDetail[]>('get', this.cartDetailsUrl);

    cartDetailsObservable.subscribe(data => {
      this.cartDetailsCache = data;
    });

    return cartDetailsObservable;
  }

  addCartDetail(newCartDetail: CartDetail): Observable<CartDetail> {
    return this.apiService.request<CartDetail>('post', this.cartDetailUrl, newCartDetail).pipe(
      tap((addedCartDetail: CartDetail) => {
        this.cartDetailsCache = [...this.cartDetailsCache, addedCartDetail];
        localStorage.setItem(this.cartDetailsUrl, JSON.stringify(this.cartDetailsCache));
      })
    );
  }

  updateCartDetail(updatedCartDetail: CartDetail): Observable<any> {
    const url = `${this.cartDetailUrl}/${updatedCartDetail.orderDetailId}`;

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

  deleteCartDetail(id: number): Observable<any> {
    if (!id) {
      return of(null);
    }

    const url = `${this.cartDetailUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.cartDetailsCache.findIndex(cartDetail => cartDetail.orderDetailId === id);

        if (index !== -1) {
          this.cartDetailsCache.splice(index, 1);
          localStorage.setItem(this.cartDetailsUrl, JSON.stringify(this.cartDetailsCache));
        }
      })
    );
  }

}