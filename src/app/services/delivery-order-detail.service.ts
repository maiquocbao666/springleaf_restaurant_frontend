import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderDetailService {

    private deliveryOrderDetailsUrl = 'deliveryOrderDetailsUrl';
    private deliveryOrderDetailUrl = 'deliveryOrderDetailUrl';
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

        return this.apiService.request<DeliveryOrderDetail>('post', this.deliveryOrderDetailUrl, newDeliveryOrderDetail).pipe(

            tap((addedDeliveryOrderDetail: DeliveryOrderDetail) => {

                this.deliveryOrderDetailsCache.push(addedDeliveryOrderDetail);
                localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));

            })

        );

    }

    updateDeliveryOrderDetail(updatedDeliveryOrderDetail: DeliveryOrderDetail): Observable<any> {

        const url = `${this.deliveryOrderDetailUrl}/${updatedDeliveryOrderDetail.deliveryOrderDetailId}`;

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

    deleteComboOrderDetail(id: number): Observable<any> {

        const url = `${this.deliveryOrderDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.deliveryOrderDetailsCache.findIndex(detail => detail.deliveryOrderDetailId === id);

                if (index !== -1) {

                    this.deliveryOrderDetailsCache.splice(index, 1);
                    localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));

                }

            })
        );

    }

}