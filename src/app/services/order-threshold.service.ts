import { OrderThreshold } from './../interfaces/order-threshold';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class OrderThresholdService {

    private orderThresholdsUrl = 'ingredients';
    orderThresholdsCache!: OrderThreshold[];

    constructor(private apiService: ApiService) { }

    
    getOrderThresholds(): Observable<OrderThreshold[]> {
       
        if (this.orderThresholdsCache) {

            console.log("Có ingredients cache");
            return of(this.orderThresholdsCache);

        }

        const orderThresholdsObservable = this.apiService.request<OrderThreshold[]>('get', this.orderThresholdsUrl);

       
        orderThresholdsObservable.subscribe(data => {

            this.orderThresholdsCache = data;
            
        });

        return orderThresholdsObservable;
        
    }

    addOrderThreshold(newOrderThreshold: OrderThreshold): Observable<OrderThreshold> {

        return this.apiService.request<OrderThreshold>('post', this.orderThresholdsUrl, newOrderThreshold).pipe(

            tap((addedOrderThreshold: OrderThreshold) => {

                this.orderThresholdsCache.push(addedOrderThreshold);
                localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

            })

        );

    }

}