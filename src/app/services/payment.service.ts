import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Payment } from '../interfaces/payment';


@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private paymentsUrl = 'restaurants'; // URL to web api, không cần thêm base URL
    paymentsCache!: Payment[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getPayments(): Observable<Payment[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.paymentsCache) {
            return of(this.paymentsCache);
        }

        const paymentsObservable = this.apiService.request<Payment[]>('get', this.paymentsUrl);

        // Cache the categories observable
        paymentsObservable.subscribe(data => {
            this.paymentsCache = data; // Store the fetched data in the cache
        });

        return paymentsObservable;
    }



}