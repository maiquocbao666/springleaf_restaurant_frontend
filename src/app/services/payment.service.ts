import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Payment } from '../interfaces/payment';


@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private paymentsUrl = 'payments'; 
    private paymentUrl = 'payment'; 
    paymentsCache!: Payment[];

    constructor(private apiService: ApiService) { }

    getPayments(): Observable<Payment[]> {
        
        if (this.paymentsCache) {

            return of(this.paymentsCache);

        }

        const paymentsObservable = this.apiService.request<Payment[]>('get', this.paymentsUrl);

        
        paymentsObservable.subscribe(data => {

            this.paymentsCache = data;

        });

        return paymentsObservable;
        
    }

    addPayMent(newPayMent: Payment): Observable<Payment> {

        return this.apiService.request<Payment>('post', this.paymentsUrl, newPayMent).pipe(

            tap((addedPayMent: Payment) => {

                this.paymentsCache.push(addedPayMent);
                localStorage.setItem(this.paymentsUrl, JSON.stringify(this.paymentsCache));

            })

        );

    }

    updatePayment(updatedPayment: Payment): Observable<any> {

        const url = `${this.paymentsUrl}/${updatedPayment.paymentId}`;

        return this.apiService.request('put', url, updatedPayment).pipe(

            tap(() => {

                const index = this.paymentsCache!.findIndex(payment => payment.paymentId === updatedPayment.paymentId);

                if (index !== -1) {

                    this.paymentsCache![index] = updatedPayment;
                    localStorage.setItem(this.paymentsUrl, JSON.stringify(this.paymentsCache));

                }

            })

        );

    }

}