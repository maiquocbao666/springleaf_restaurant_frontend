import { BillDetail } from '../interfaces/bill-detail';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';



@Injectable({
    providedIn: 'root'
})
export class BillDetailService {

    private billDetailsUrl = 'billDetails'; // URL to web api, không cần thêm base URL
    billDetailsCache!: BillDetail[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getBillDetails(): Observable<BillDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.billDetailsCache) {
            return of(this.billDetailsCache);
        }

        const billDetailsObservable = this.apiService.request<BillDetail[]>('get', this.billDetailsUrl);

        // Cache the categories observable
        billDetailsObservable.subscribe(data => {
            this.billDetailsCache = data; // Store the fetched data in the cache
        });

        return billDetailsObservable;
    }



}