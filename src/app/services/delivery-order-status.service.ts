import { DeliveryOrderStatus } from './../interfaces/delivery-order-status';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderStatusService {

    private deliveryOrderStatusesUrl = 'deliveryOrderStatuses'; // URL to web api, không cần thêm base URL
    deliveryOrderStatusesCache!: DeliveryOrderStatus[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getDeliveryOrderStatuss(): Observable<DeliveryOrderStatus[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.deliveryOrderStatusesCache) {
            return of(this.deliveryOrderStatusesCache);
        }

        const deliveryOrderStatussObservable = this.apiService.request<DeliveryOrderStatus[]>('get', this.deliveryOrderStatusesUrl);

        // Cache the categories observable
        deliveryOrderStatussObservable.subscribe(data => {
            this.deliveryOrderStatusesCache = data; // Store the fetched data in the cache
        });

        return deliveryOrderStatussObservable;
    }



}