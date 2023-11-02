import { Bill } from '../interfaces/bill';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class BillService {

    private billsUrl = 'bills'; // URL to web api, không cần thêm base URL
    billsCache!: Bill[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getBills(): Observable<Bill[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.billsCache) {
            return of(this.billsCache);
        }

        const billsObservable = this.apiService.request<Bill[]>('get', this.billsUrl);

        // Cache the categories observable
        billsObservable.subscribe(data => {
            this.billsCache = data; // Store the fetched data in the cache
        });

        return billsObservable;
    }



}