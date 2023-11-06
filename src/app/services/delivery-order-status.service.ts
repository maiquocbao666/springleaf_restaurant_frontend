import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderStatus } from './../interfaces/delivery-order-status';




@Injectable({
    providedIn: 'root'
})
export class DeliveryOrderStatusService {

    private deliveryOrderStatusesUrl = 'deliveryOrderStatusesUrl';
    private deliveryOrderStatusUrl = 'deliveryOrderStatusUrl';
    deliveryOrderStatusesCache!: DeliveryOrderStatus[];

    constructor(private apiService: ApiService) { }

    getDeliveryOrderStatuss(): Observable<DeliveryOrderStatus[]> {

        if (this.deliveryOrderStatusesCache) {

            return of(this.deliveryOrderStatusesCache);

        }

        const deliveryOrderStatussObservable = this.apiService.request<DeliveryOrderStatus[]>('get', this.deliveryOrderStatusesUrl);

        deliveryOrderStatussObservable.subscribe(data => {

            this.deliveryOrderStatusesCache = data;

        });

        return deliveryOrderStatussObservable;

    }

    addDeliveryOrderStatus(newDeliveryOrderStatus: DeliveryOrderStatus): Observable<DeliveryOrderStatus> {

        return this.apiService.request<DeliveryOrderStatus>('post', this.deliveryOrderStatusUrl, newDeliveryOrderStatus).pipe(

            tap((addedDeliveryOrderStatus: DeliveryOrderStatus) => {

                this.deliveryOrderStatusesCache.push(addedDeliveryOrderStatus);
                localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));

            })

        );

    }

    updateDeliveryOrderStatus(updatedDeliveryOrderStatus: DeliveryOrderStatus): Observable<any> {

        const url = `${this.deliveryOrderStatusUrl}/${updatedDeliveryOrderStatus.deliveryOrderStatusId}`;

        return this.apiService.request('put', url, updatedDeliveryOrderStatus).pipe(

            tap(() => {

                const index = this.deliveryOrderStatusesCache!.findIndex(deliveryOrderStatus => deliveryOrderStatus.deliveryOrderStatusId === updatedDeliveryOrderStatus.deliveryOrderStatusId);

                if (index !== -1) {

                    this.deliveryOrderStatusesCache![index] = updatedDeliveryOrderStatus;
                    localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));

                }

            })

        );

    }

    deleteComboOrderStatus(id: number): Observable<any> {

        const url = `${this.deliveryOrderStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.deliveryOrderStatusesCache.findIndex(status => status.deliveryOrderStatusId === id);

                if (index !== -1) {

                    this.deliveryOrderStatusesCache.splice(index, 1);
                    localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));

                }

            })
        );

    }


}