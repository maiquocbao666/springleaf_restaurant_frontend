
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';



@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderService {

    private deliveryOrdersUrl = 'deliveryOrders';
    private deliveryOrderUrl = 'deliveryOrder';
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

    addDeliveryOrder(newDeliveryOrder: DeliveryOrder): Observable<DeliveryOrder> {

        return this.apiService.request<DeliveryOrder>('post', this.deliveryOrdersUrl, newDeliveryOrder).pipe(

            tap((addedDeliveryOrder: DeliveryOrder) => {

                this.deliveryOrdersCache.push(addedDeliveryOrder);
                localStorage.setItem(this.deliveryOrdersUrl, JSON.stringify(this.deliveryOrdersCache));

            })

        );

    }

    updateDeliveryOrder(updatedDeliveryOrder: DeliveryOrder): Observable<any> {

        const url = `${this.deliveryOrdersUrl}/${updatedDeliveryOrder.deliveryOrderId}`;

        return this.apiService.request('put', url, updatedDeliveryOrder).pipe(

            tap(() => {

                const index = this.deliveryOrdersCache!.findIndex(deliveryOrder => deliveryOrder.deliveryOrderId === updatedDeliveryOrder.deliveryOrderId);

                if (index !== -1) {

                    this.deliveryOrdersCache![index] = updatedDeliveryOrder;
                    localStorage.setItem(this.deliveryOrdersUrl, JSON.stringify(this.deliveryOrdersCache));

                }

            })

        );

    }

}