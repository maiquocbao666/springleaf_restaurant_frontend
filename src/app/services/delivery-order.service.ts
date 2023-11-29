import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderService extends BaseService<DeliveryOrder>  {
  private userCartSubject = new BehaviorSubject<DeliveryOrder | null>(null);
  userCart$ = this.userCartSubject.asObservable();

  

  apisUrl = 'deliveryOrders';
  cacheKey = 'deliveryOrders';
  apiUrl = 'deliveryOrder';

  //-----------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //-----------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  getItemId(item: DeliveryOrder): number {
    throw new Error('Method not implemented.');
  }

  getItemName(item: DeliveryOrder): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return 'DeliveryOrder';
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-----------------------------------------------------------------------------------------

  override add(newDeliveryOrder: DeliveryOrder): Observable<DeliveryOrder> {
    return super.add(newDeliveryOrder);
  }

  override update(updated: DeliveryOrder): Observable<any> {
    return super.update(updated);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  getUserCart(): Observable<DeliveryOrder | null> {
    const jwtToken = localStorage.getItem('access_token');
    if (!jwtToken) {
      return of(null);
    }
  
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });
  
    return this.apiService.request<DeliveryOrder>('get', 'user/getCartByUser', null, customHeader)
      .pipe(
        tap(cart => {
          this.userCartSubject.next(cart);
        })
      );
  }


}