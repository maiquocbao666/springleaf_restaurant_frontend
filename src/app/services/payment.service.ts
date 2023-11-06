import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Payment } from '../interfaces/payment';


@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private paymentsUrl = 'restaurants'; 
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



}