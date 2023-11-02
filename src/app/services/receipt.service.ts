import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Receipt } from '../interfaces/receipt';


@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    private receiptsUrl = 'restaurants'; // URL to web api, không cần thêm base URL
    receiptsCache!: Receipt[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getReceipts(): Observable<Receipt[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.receiptsCache) {
            return of(this.receiptsCache);
        }

        const receiptsObservable = this.apiService.request<Receipt[]>('get', this.receiptsUrl);

        // Cache the categories observable
        receiptsObservable.subscribe(data => {
            this.receiptsCache = data; // Store the fetched data in the cache
        });

        return receiptsObservable;
    }



}