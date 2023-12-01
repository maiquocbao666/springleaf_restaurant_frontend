import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CartDetail } from '../interfaces/cart-detail';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class CartDetailService extends BaseService<CartDetail> {
  
  private orderDetailsSubject = new BehaviorSubject<CartDetail[] | null>(null);
  orderDetails$: Observable<CartDetail[] | null> = this.orderDetailsSubject.asObservable();
  
  //----------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //-----------------------------------------------------------------

  apisUrl = 'cartDetails';
  cacheKey = 'cartDetails';
  apiUrl = 'cartDetail';

  //------------------------------------------------------------------

  getItemId(item: CartDetail): number {
    return item.orderDetailId!;
  }

  getItemName(item: CartDetail): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    throw new Error('Method not implemented.');
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
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

  //----------------------------------------------------------------------

  getUserOrderDetail(orderId: number): Observable<CartDetail[] | null> {
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

  deleteDetail(id : number) : void{
    const jwtToken = localStorage.getItem('access_token');
    if (!jwtToken) {
       of(null);
    }
    
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });
    const url = `cartDetail/${id}`
    this.apiService.request<null>('delete', url, null, customHeader)
  }

  

}