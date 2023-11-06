import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderDetailService {

    private deliveryOrderDetailsUrl = 'deliveryOrderDetails';
    deliveryOrderDetailsCache!: DeliveryOrderDetail[];

    constructor(private apiService: ApiService) { } 

    getDeliveryOrderDetails(): Observable<DeliveryOrderDetail[]> {
        
        if (this.deliveryOrderDetailsCache) {

            return of(this.deliveryOrderDetailsCache);
        }

        const DeliveryOrderDetailsObservable = this.apiService.request<DeliveryOrderDetail[]>('get', this.deliveryOrderDetailsUrl);

        
        DeliveryOrderDetailsObservable.subscribe(data => {
            this.deliveryOrderDetailsCache = data; 
        });

        return DeliveryOrderDetailsObservable;
        
    }



}