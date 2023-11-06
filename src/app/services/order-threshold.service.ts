import { OrderThreshold } from './../interfaces/order-threshold';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class OrderThresholdService {

    private orderThresholdsUrl = 'ingredientsUrl';
    private orderThresholdUrl = 'ingredientUrl';
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

        return this.apiService.request<OrderThreshold>('post', this.orderThresholdUrl, newOrderThreshold).pipe(

            tap((addedOrderThreshold: OrderThreshold) => {

                this.orderThresholdsCache.push(addedOrderThreshold);
                localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

            })

        );

    }

    updateOrderThreshold(updatedOrderThreshold: OrderThreshold): Observable<any> {

        const url = `${this.orderThresholdUrl}/${updatedOrderThreshold.orderThresholdId}`;

        return this.apiService.request('put', url, updatedOrderThreshold).pipe(

            tap(() => {

                const index = this.orderThresholdsCache!.findIndex(orderThreshold => orderThreshold.orderThresholdId === updatedOrderThreshold.orderThresholdId);

                if (index !== -1) {

                    this.orderThresholdsCache![index] = updatedOrderThreshold;
                    localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

                }

            })

        );

    }


    deleteOrderThreshold(id: number): Observable<any> {

        const url = `${this.orderThresholdUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.orderThresholdsCache.findIndex(orderThreshold => orderThreshold.orderThresholdId === id);

                if (index !== -1) {

                    this.orderThresholdsCache.splice(index, 1);
                    localStorage.setItem(this.orderThresholdsUrl, JSON.stringify(this.orderThresholdsCache));

                }

            })
        );

    }

}