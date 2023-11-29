import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CartDetail } from '../interfaces/cart-detail';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../interfaces/cart';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class CartDetailService extends BaseService<CartDetail> {
  private orderDetailsSubject = new BehaviorSubject<CartDetail[] | null>(null);
  orderDetails$ = this.orderDetailsSubject.asObservable();

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apisUrl = 'cartDetails';
  cacheKey = 'cartDetails';
  apiUrl = 'cartDetail';


  override gets(): Observable<CartDetail[]> {
    return super.gets();
  }

  override getById(id: number): Observable<CartDetail | null> {
    return super.getById(id);
  }

  override add(newProduct: CartDetail): Observable<CartDetail> {
    return super.add(newProduct);
  }

  override update(updated: CartDetail): Observable<any> {
    return super.update(updated);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override getItemId(item: CartDetail): number {
    throw new Error('Method not implemented.');
  }
  override getItemName(item: CartDetail): string {
    throw new Error('Method not implemented.');
  }
  override getObjectName(): string {
    throw new Error('Method not implemented.');
  }

  getUserOrder(orderId: number): Observable<CartDetail[] | null> {
    const jwtToken = localStorage.getItem('access_token');
    if (!jwtToken) {
      return of(null);
    }
    
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });

    const orderDetailsObservable = this.apiService.request<CartDetail[]>('post', 'user/getOrderDetailByUser', orderId, customHeader)
      .pipe(
        tap(orderDetails => {
          this.orderDetailsSubject.next(orderDetails); // Thông báo cho subscribers khi có sự thay đổi
        })
      );

    return orderDetailsObservable;
  }

  

}