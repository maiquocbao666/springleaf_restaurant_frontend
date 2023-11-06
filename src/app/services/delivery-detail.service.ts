import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryDetail } from '../interfaces/delivery-detail';


@Injectable({
    providedIn: 'root'
})
export class DeliveryDetailService {

    private deliveryDetailsUrl = 'deliveryDetails';
    private deliveryDetailUrl = 'deliveryDetail';
    deliveryDetailsCache!: DeliveryDetail[];

    constructor(private apiService: ApiService) { }

    getDeliveryDetails(): Observable<DeliveryDetail[]> {
       
        if (this.deliveryDetailsCache) {

            return of(this.deliveryDetailsCache);

        }

        const DeliveryDetailsObservable = this.apiService.request<DeliveryDetail[]>('get', this.deliveryDetailsUrl);

        DeliveryDetailsObservable.subscribe(data => {

            this.deliveryDetailsCache = data; 

        });

        return DeliveryDetailsObservable;

    }

    addDeliveryDetail(newDeliveryDetail: DeliveryDetail): Observable<DeliveryDetail> {

        return this.apiService.request<DeliveryDetail>('post', this.deliveryDetailsUrl, newDeliveryDetail).pipe(

            tap((addedDeliveryDetail: DeliveryDetail) => {

                this.deliveryDetailsCache.push(addedDeliveryDetail);
                localStorage.setItem(this.deliveryDetailsUrl, JSON.stringify(this.deliveryDetailsCache));

            })

        );

    }

    updateDeliveryDetail(updatedDeliveryDetail: DeliveryDetail): Observable<any> {

        const url = `${this.deliveryDetailsUrl}/${updatedDeliveryDetail.deliveryDetailId}`;

        return this.apiService.request('put', url, updatedDeliveryDetail).pipe(

            tap(() => {

                const index = this.deliveryDetailsCache!.findIndex(deliveryDetail => deliveryDetail.deliveryDetailId === updatedDeliveryDetail.deliveryDetailId);

                if (index !== -1) {

                    this.deliveryDetailsCache![index] = updatedDeliveryDetail;
                    localStorage.setItem(this.deliveryDetailsUrl, JSON.stringify(this.deliveryDetailsCache));

                }

            })

        );

    }

}