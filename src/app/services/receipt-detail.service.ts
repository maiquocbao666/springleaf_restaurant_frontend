import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReceiptDetail } from '../interfaces/receipt-detail';


@Injectable({
    providedIn: 'root'
})
export class ReceiptDetailService {

    private receiptDetailsUrl = 'restaurants'; // URL to web api, không cần thêm base URL
    receiptDetailsCache!: ReceiptDetail[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getReceiptDetails(): Observable<ReceiptDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.receiptDetailsCache) {
            return of(this.receiptDetailsCache);
        }

        const receiptDetailsObservable = this.apiService.request<ReceiptDetail[]>('get', this.receiptDetailsUrl);

        // Cache the categories observable
        receiptDetailsObservable.subscribe(data => {
            this.receiptDetailsCache = data; // Store the fetched data in the cache
        });

        return receiptDetailsObservable;
    }



}