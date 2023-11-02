import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryDetail } from '../interfaces/delivery-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryDetailService {

    private deliveryDetailsUrl = 'deliveryDetails'; // URL to web api, không cần thêm base URL
    deliveryDetailsCache!: DeliveryDetail[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getDeliveryDetails(): Observable<DeliveryDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.deliveryDetailsCache) {
            return of(this.deliveryDetailsCache);
        }

        const DeliveryDetailsObservable = this.apiService.request<DeliveryDetail[]>('get', this.deliveryDetailsUrl);

        // Cache the categories observable
        DeliveryDetailsObservable.subscribe(data => {
            this.deliveryDetailsCache = data; // Store the fetched data in the cache
        });

        return DeliveryDetailsObservable;
    }



}