
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Combo } from '../interfaces/combo';
import { Delivery } from '../interfaces/delivery';


@Injectable({
    providedIn: 'root'
})
export class DeliveryService {

    private deliveriesUrl = 'deliveries'; // URL to web api, không cần thêm base URL
    deliveriesCache!: Delivery[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getDeliverys(): Observable<Delivery[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.deliveriesCache) {
            return of(this.deliveriesCache);
        }

        const deliverysObservable = this.apiService.request<Delivery[]>('get', this.deliveriesUrl);

        // Cache the categories observable
        deliverysObservable.subscribe(data => {
            this.deliveriesCache = data; // Store the fetched data in the cache
        });

        return deliverysObservable;
    }



}