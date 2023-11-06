import { OrderType } from './../interfaces/order-type';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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



}