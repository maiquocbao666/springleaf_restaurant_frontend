import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Payment } from '../interfaces/payment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentsUrl = 'payments';
  private paymentUrl = 'payment';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private paymentsCacheSubject = new BehaviorSubject<Payment[]>([]);
  paymentsCache$ = this.paymentsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get paymentsCache(): Payment[] {
    return this.paymentsCacheSubject.value;
  }

  set paymentsCache(value: Payment[]) {
    this.paymentsCacheSubject.next(value);
  }

  getPayments(): Observable<Payment[]> {
    if (this.paymentsCache.length > 0) {
      return of(this.paymentsCache);
    }

    const paymentsObservable = this.apiService.request<Payment[]>('get', this.paymentsUrl);

    paymentsObservable.subscribe(data => {
      this.paymentsCache = data;
    });

    return paymentsObservable;
  }

  addPayment(newPayment: Payment): Observable<Payment> {
    return this.apiService.request<Payment>('post', this.paymentUrl, newPayment).pipe(
      tap((addedPayment: Payment) => {
        this.paymentsCache = [...this.paymentsCache, addedPayment];
        localStorage.setItem(this.paymentsUrl, JSON.stringify(this.paymentsCache));
      })
    );
  }

  updatePayment(updatedPayment: Payment): Observable<any> {
    const url = `${this.paymentUrl}/${updatedPayment.paymentId}`;

    return this.apiService.request('put', url, updatedPayment).pipe(
      tap(() => {
        this.updatePaymentCache(updatedPayment);
      })
    );
  }

  deletePayment(id: number): Observable<any> {
    const url = `${this.paymentUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        this.paymentsCache = this.paymentsCache.filter(payment => payment.paymentId !== id);
        localStorage.setItem(this.paymentsUrl, JSON.stringify(this.paymentsCache));
      })
    );
  }

  updatePaymentCache(updatedPayment: Payment): void {
    if (this.paymentsCache) {
      const index = this.paymentsCache.findIndex(payment => payment.paymentId === updatedPayment.paymentId);

      if (index !== -1) {
        this.paymentsCache[index] = updatedPayment;
      }
    }
  }
}