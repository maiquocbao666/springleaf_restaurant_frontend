import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Order } from '../interfaces/order';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUrl = 'carts';
  private orderUrl = 'cart';
  private userOrderCacheSubject = new BehaviorSubject<Order | null>(null);
  userOrderCache$ = this.userOrderCacheSubject.asObservable();
  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private ordersCacheSubject = new BehaviorSubject<Order[]>([]);
  ordersCache$ = this.ordersCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }
  
  // Cache order cho từng user
  setUserOrderCache(order: Order | null): void {
    this.userOrderCacheSubject.next(order);
  }
  getUserOrderCache(): Observable<Order | null> {
    return this.userOrderCache$;
  }
  // --------------------------------------------------------------


  get ordersCache(): Order[] {
    return this.ordersCacheSubject.value;
  }

  set ordersCache(value: Order[]) {
    this.ordersCacheSubject.next(value);
  }

  gets(): Observable<Order[]> {
    if (this.ordersCache) {
      return of(this.ordersCache);
    }

    const ordersObservable = this.apiService.request<Order[]>('get', this.ordersUrl);

    ordersObservable.subscribe(data => {
      this.ordersCache = data;
    });

    return ordersObservable;
  }

  getById(id: number): Observable<Order | null> {
    if (!id) {
      return of(null);
    }

    if (!this.ordersCache) {
      this.gets();
    }

    const orderFromCache = this.ordersCache.find(order => order.orderId === id);

    if (orderFromCache) {
      return of(orderFromCache);
    } else {
      const url = `${this.orderUrl}/${id}`;
      return this.apiService.request<Order>('get', url);
    }
  }

  add(newOrder: Order): Observable<Order> {
    return this.apiService.request<Order>('post', this.orderUrl, newOrder).pipe(
      tap((addedOrder: Order) => {
        this.ordersCache = [...this.ordersCache, addedOrder];
        localStorage.setItem(this.ordersUrl, JSON.stringify(this.ordersCache));
      })
    );
  }

  update(updatedOrder: Order): Observable<Order> {
    const url = `${this.orderUrl}/${updatedOrder.orderId}`;

    return this.apiService.request<Order>('put', url, updatedOrder).pipe(
      tap((response: Order) => {
        this.updateCache(response);
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.orderUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        this.ordersCache = this.ordersCache.filter(order => order.orderId !== id);
        localStorage.setItem(this.ordersUrl, JSON.stringify(this.ordersCache));
      })
    );
  }

  updateCache(updatedOrder: Order): void {
    if (this.ordersCache) {
      const index = this.ordersCache.findIndex(ord => ord.orderId === updatedOrder.orderId);

      if (index !== -1) {
        this.ordersCache[index] = updatedOrder;
      }
    }
  }

  getUserOrder(deliveryOrder: number): Observable<Order | null> {
    const jwtToken = sessionStorage.getItem('access_token');
    const deliveryOrderId = deliveryOrder;

    if (!jwtToken) {
      return of(null);
    }
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });

    return this.apiService.request<Order>('post', 'user/getOrderByUser', deliveryOrderId, customHeader)
      .pipe(
        tap(order => {
          this.setUserOrderCache(order);
        })
      );
  }

}