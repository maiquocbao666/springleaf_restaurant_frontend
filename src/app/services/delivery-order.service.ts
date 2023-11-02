
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';



@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderService {

    private deliveryOrdersUrl = 'deliveryOrders'; // URL to web api, không cần thêm base URL
    deliveryOrdersCache!: DeliveryOrder[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getDeliveryOrders(): Observable<DeliveryOrder[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.deliveryOrdersCache) {
            return of(this.deliveryOrdersCache);
        }

        const deliveryOrdersObservable = this.apiService.request<DeliveryOrder[]>('get', this.deliveryOrdersUrl);

        // Cache the categories observable
        deliveryOrdersObservable.subscribe(data => {
            this.deliveryOrdersCache = data; // Store the fetched data in the cache
        });

        return deliveryOrdersObservable;
    }



}