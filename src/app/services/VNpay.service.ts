import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order } from '../interfaces/order';
import { CartDetail } from '../interfaces/cart-detail';


@Injectable({
  providedIn: 'root'
})
export class VNPayService {

  private submitOrderUrl = 'submitOrder';
  private getPaymentStatusUrl = 'https://springleafrestaurantbackend.onrender.com/public/vnpay-payment';

  constructor(private apiService: ApiService) { }

  submitOrder(orderTotal: number, orderInfo: string): Observable<any> {
    const body = {
      orderTotal: orderTotal,
      orderInfo: orderInfo,
    };

    return this.apiService.request<any>('post', this.submitOrderUrl, body);
  }

  getPaymentStatus(): Observable<any> {
    return this.apiService.request<any>('get', this.getPaymentStatusUrl);
  }

}
