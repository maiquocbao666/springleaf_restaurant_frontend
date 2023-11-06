import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderDetailService {

    private deliveryOrderDetailsUrl = 'deliveryOrderDetails';
    private deliveryOrderDetailUrl = 'deliveryOrderDetail';
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

    addDeliveryOrderDetail(newDeliveryOrderDetail: DeliveryOrderDetail): Observable<DeliveryOrderDetail> {

        return this.apiService.request<DeliveryOrderDetail>('post', this.deliveryOrderDetailsUrl, newDeliveryOrderDetail).pipe(

            tap((addedDeliveryOrderDetail: DeliveryOrderDetail) => {

                this.deliveryOrderDetailsCache.push(addedDeliveryOrderDetail);
                localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));

            })

        );

    }

    updateDeliveryOrderDetail(updatedDeliveryOrderDetail: DeliveryOrderDetail): Observable<any> {

        const url = `${this.deliveryOrderDetailsUrl}/${updatedDeliveryOrderDetail.deliveryOrderDetailId}`;

        return this.apiService.request('put', url, updatedDeliveryOrderDetail).pipe(

            tap(() => {

                const index = this.deliveryOrderDetailsCache!.findIndex(deliveryOrderDetail => deliveryOrderDetail.deliveryOrderDetailId === updatedDeliveryOrderDetail.deliveryOrderDetailId);

                if (index !== -1) {

                    this.deliveryOrderDetailsCache![index] = updatedDeliveryOrderDetail;
                    localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));

                }

            })

        );

    }

}