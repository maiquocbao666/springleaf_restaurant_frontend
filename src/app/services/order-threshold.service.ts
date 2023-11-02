import { OrderThreshold } from './../interfaces/order-threshold';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class OrderThresholdService {

    private orderThresholdsUrl = 'ingredients'; // URL to web api, không cần thêm base URL
    orderThresholdsCache!: OrderThreshold[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getOrderThresholds(): Observable<OrderThreshold[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.orderThresholdsCache) {
            console.log("Có ingredients cache");
            return of(this.orderThresholdsCache);
        }

        const orderThresholdsObservable = this.apiService.request<OrderThreshold[]>('get', this.orderThresholdsUrl);

        // Cache the categories observable
        orderThresholdsObservable.subscribe(data => {
            this.orderThresholdsCache = data; // Store the fetched data in the cache
        });

        return orderThresholdsObservable;
    }



}