
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';



@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderService {

    private deliveryOrdersUrl = 'deliveryOrdersUrl';
    private deliveryOrderUrl = 'deliveryOrderUrl';
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

        return this.apiService.request<DeliveryOrder>('post', this.deliveryOrderUrl, newDeliveryOrder).pipe(

            tap((addedDeliveryOrder: DeliveryOrder) => {

                this.deliveryOrdersCache.push(addedDeliveryOrder);
                localStorage.setItem(this.deliveryOrdersUrl, JSON.stringify(this.deliveryOrdersCache));

            })

        );

    }

    updateDeliveryOrder(updatedDeliveryOrder: DeliveryOrder): Observable<any> {

        const url = `${this.deliveryOrderUrl}/${updatedDeliveryOrder.deliveryOrderId}`;

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

    deleteDeliveryOrder(id: number): Observable<any> {

        const url = `${this.deliveryOrderUrl}/${id}`;
    
        return this.apiService.request('delete', url).pipe(
    
            tap(() => {
    
                const index = this.deliveryOrdersCache.findIndex(deliveryOrder => deliveryOrder.deliveryOrderId === id);
    
                if (index !== -1) {
    
                    this.deliveryOrdersCache.splice(index, 1);
                    localStorage.setItem(this.deliveryOrdersUrl, JSON.stringify(this.deliveryOrdersCache));
    
                }
    
            })
        );
    
    }
    

}