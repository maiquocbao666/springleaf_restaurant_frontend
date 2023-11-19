import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersUrl = 'carts';
  ordersCache!: Order[];
  private orderUrl = 'cart';

  constructor(private apiService: ApiService) { }

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
    if (!this.ordersCache) {
      this.ordersCache = []; // Khởi tạo nếu chưa tồn tại
    }

    return this.apiService.request<Order>('post', 'cart', newOrder).pipe(
      tap((addedOrder: Order) => {
        this.ordersCache.push(addedOrder);
        localStorage.setItem('carts', JSON.stringify(this.ordersCache));
      })
    );
  }



  updateOrder(updatedOrder: Order): Observable<Order> {
    const url = `${this.orderUrl}/${updatedOrder.orderId}`;

    return this.apiService.request<Order>('put', url, updatedOrder).pipe(
      tap((response: Order) => {
        const index = this.ordersCache.findIndex(order => order.orderId === response.orderId);

        if (index !== -1) {
          this.ordersCache[index] = response;
          localStorage.setItem('carts', JSON.stringify(this.ordersCache));
        }
      })
    );
  }


  deleteOrder(id: number): Observable<any> {
    const url = `${this.orderUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.ordersCache.findIndex(order => order.orderId === id);

        if (index !== -1) {
          this.ordersCache.splice(index, 1);
          localStorage.setItem('carts', JSON.stringify(this.ordersCache));
        }
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
