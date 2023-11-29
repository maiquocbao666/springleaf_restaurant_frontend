import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class VNPayService {

  private submitOrderUrl = 'submitOrder';
  private getPaymentStatusUrl = 'vnpay-payment';

  constructor(private apiService: ApiService) { }

  submitOrder(orderTotal: number, orderInfo: string): Observable<any> {
    const body = {
      orderTotal: orderTotal,
      orderInfo: orderInfo
    };

    return this.apiService.request<any>('post', this.submitOrderUrl, body);
  }

  getPaymentStatus(): Observable<any> {
    return this.apiService.request<any>('get', this.getPaymentStatusUrl);
  }

}
