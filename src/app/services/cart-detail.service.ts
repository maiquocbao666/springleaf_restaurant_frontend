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

  //----------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
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

}