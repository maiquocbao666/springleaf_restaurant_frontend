import { OrderType } from './../interfaces/order-type';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class OrderTypeService {

    private orderTypesUrl = 'ingredients'; // URL to web api, không cần thêm base URL
    orderTypesCache!: OrderType[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getOrderTypes(): Observable<OrderType[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.orderTypesCache) {
            console.log("Có ingredients cache");
            return of(this.orderTypesCache);
        }

        const orderTypesObservable = this.apiService.request<OrderType[]>('get', this.orderTypesUrl);

        // Cache the categories observable
        orderTypesObservable.subscribe(data => {
            this.orderTypesCache = data; // Store the fetched data in the cache
        });

        return orderTypesObservable;
    }



}