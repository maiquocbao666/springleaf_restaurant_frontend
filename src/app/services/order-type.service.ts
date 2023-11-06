import { OrderType } from './../interfaces/order-type';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class OrderTypeService {

    private orderTypesUrl = 'ingredients';
    orderTypesCache!: OrderType[];

    constructor(private apiService: ApiService) { }

    
    getOrderTypes(): Observable<OrderType[]> {
        
        if (this.orderTypesCache) {

            console.log("Có ingredients cache");
            return of(this.orderTypesCache);

        }

        const orderTypesObservable = this.apiService.request<OrderType[]>('get', this.orderTypesUrl);

        
        orderTypesObservable.subscribe(data => {

            this.orderTypesCache = data;

        });

        return orderTypesObservable;
        
    }

    addOrderType(newOrderType: OrderType): Observable<OrderType> {

        return this.apiService.request<OrderType>('post', this.orderTypesUrl, newOrderType).pipe(

            tap((addedOrderType: OrderType) => {

                this.orderTypesCache.push(addedOrderType);
                localStorage.setItem(this.orderTypesUrl, JSON.stringify(this.orderTypesCache));

            })

        );

    }

    updateOrderType(updatedOrderType: OrderType): Observable<any> {

        const url = `${this.orderTypesUrl}/${updatedOrderType.orderTypeId}`;

        return this.apiService.request('put', url, updatedOrderType).pipe(

            tap(() => {

                const index = this.orderTypesCache!.findIndex(orderType => orderType.orderTypeId === updatedOrderType.orderTypeId);

                if (index !== -1) {

                    this.orderTypesCache![index] = updatedOrderType;
                    localStorage.setItem(this.orderTypesUrl, JSON.stringify(this.orderTypesCache));

                }

            })

        );

    }

}