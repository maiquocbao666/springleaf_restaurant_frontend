import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Order } from '../interfaces/order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUrl = 'carts';
  private orderUrl = 'cart';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private ordersCacheSubject = new BehaviorSubject<Order[]>([]);
  ordersCache$ = this.ordersCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get ordersCache(): Order[] {
    return this.ordersCacheSubject.value;
  }

  set ordersCache(value: Order[]) {
    this.ordersCacheSubject.next(value);
  }

  getOrders(): Observable<Order[]> {
    if (this.ordersCache) {
      return of(this.ordersCache);
    }

    const ordersObservable = this.apiService.request<Order[]>('get', this.ordersUrl);

    ordersObservable.subscribe(data => {
      this.ordersCache = data;
    });

    return ordersObservable;
  }

  getOrderById(id: number): Observable<Order | null> {
    if (!id) {
      return of(null);
    }

    if (!this.ordersCache) {
      this.getOrders();
    }

    const orderFromCache = this.ordersCache.find(order => order.orderId === id);

    if (orderFromCache) {
      return of(orderFromCache);
    } else {
      const url = `${this.orderUrl}/${id}`;
      return this.apiService.request<Order>('get', url);
    }
  }

  addOrder(newOrder: Order): Observable<Order> {
    return this.apiService.request<Order>('post', this.orderUrl, newOrder).pipe(
      tap((addedOrder: Order) => {
        this.ordersCache = [...this.ordersCache, addedOrder];
        localStorage.setItem(this.ordersUrl, JSON.stringify(this.ordersCache));
      })
    );
  }

  updateOrder(updatedOrder: Order): Observable<Order> {
    const url = `${this.orderUrl}/${updatedOrder.orderId}`;

    return this.apiService.request<Order>('put', url, updatedOrder).pipe(
      tap((response: Order) => {
        this.updateOrderCache(response);
      })
    );
  }

  deleteOrder(id: number): Observable<any> {
    const url = `${this.orderUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        this.ordersCache = this.ordersCache.filter(order => order.orderId !== id);
        localStorage.setItem(this.ordersUrl, JSON.stringify(this.ordersCache));
      })
    );
  }

  updateOrderCache(updatedOrder: Order): void {
    if (this.ordersCache) {
      const index = this.ordersCache.findIndex(ord => ord.orderId === updatedOrder.orderId);

      if (index !== -1) {
        this.ordersCache[index] = updatedOrder;
      }
    }
  }
}