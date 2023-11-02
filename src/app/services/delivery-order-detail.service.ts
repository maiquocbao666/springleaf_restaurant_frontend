import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderDetailService {

    private deliveryOrderDetailsUrl = 'deliveryOrderDetails'; // URL to web api, không cần thêm base URL
    deliveryOrderDetailsCache!: DeliveryOrderDetail[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getDeliveryOrderDetails(): Observable<DeliveryOrderDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.deliveryOrderDetailsCache) {
            return of(this.deliveryOrderDetailsCache);
        }

        const DeliveryOrderDetailsObservable = this.apiService.request<DeliveryOrderDetail[]>('get', this.deliveryOrderDetailsUrl);

        // Cache the categories observable
        DeliveryOrderDetailsObservable.subscribe(data => {
            this.deliveryOrderDetailsCache = data; // Store the fetched data in the cache
        });

        return DeliveryOrderDetailsObservable;
    }



}