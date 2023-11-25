import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class VNPayService {

  private submitOrderUrl = 'submitOrder';
  private getPaymentStatusUrl = 'vnpay-payment';

  constructor(private apiService: ApiService) { }

  // Trong hàm submitOrder hoặc các hàm gửi request tương tự trong service của bạn:
  submitOrder(orderTotal: number, orderInfo: string): Observable<any> {
    const formData = new FormData();
    formData.append('orderTotal', orderTotal.toString());
    formData.append('orderInfo', orderInfo);

    return this.apiService.request<any>('post', this.submitOrderUrl, formData).pipe(
      catchError((error) => {
        console.error('Error occurred:', error); // In ra lỗi chi tiết
        return throwError(error); // Chuyển tiếp lỗi để xử lý ở các tầng gọi service
      })
    );
  }

  getPaymentStatus(request: any): Observable<any> {
    return this.apiService.request<any>('get', this.getPaymentStatusUrl, { params: request });
  }
}
