
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';



@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderService {

    private deliveryOrdersUrl = 'deliveryOrders';
    deliveryOrdersCache!: DeliveryOrder[];

    constructor(private apiService: ApiService) { } 

    
    getDeliveryOrders(): Observable<DeliveryOrder[]> {
        
        if (this.deliveryOrdersCache) {

            return of(this.deliveryOrdersCache);

        }

        const deliveryOrdersObservable = this.apiService.request<DeliveryOrder[]>('get', this.deliveryOrdersUrl);

        
        deliveryOrdersObservable.subscribe(data => {

            this.deliveryOrdersCache = data;

        });

        return deliveryOrdersObservable;
        
    }



}