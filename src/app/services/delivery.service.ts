
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Delivery } from '../interfaces/delivery';


@Injectable({
    providedIn: 'root'
})
export class DeliveryService {

    private deliveriesUrl = 'deliveries';
    private deliveryUrl = 'delivery';
    deliveriesCache!: Delivery[];

    constructor(private apiService: ApiService) { }


    getDeliverys(): Observable<Delivery[]> {

        if (this.deliveriesCache) {

            return of(this.deliveriesCache);

        }

        const deliverysObservable = this.apiService.request<Delivery[]>('get', this.deliveriesUrl);


        deliverysObservable.subscribe(data => {

            this.deliveriesCache = data;

        });

        return deliverysObservable;

    }

    addDelivery(newDelivery: Delivery): Observable<Delivery> {

        return this.apiService.request<Delivery>('post', this.deliveryUrl, newDelivery).pipe(

            tap((addedDelivery: Delivery) => {

                this.deliveriesCache.push(addedDelivery);
                localStorage.setItem(this.deliveriesUrl, JSON.stringify(this.deliveriesCache));

            })

        );

    }

    updateDelivery(updatedDelivery: Delivery): Observable<any> {

        const url = `${this.deliveryUrl}/${updatedDelivery.deliveryId}`;

        return this.apiService.request('put', url, updatedDelivery).pipe(

            tap(() => {

                const index = this.deliveriesCache!.findIndex(delivery => delivery.deliveryId === updatedDelivery.deliveryId);

                if (index !== -1) {

                    this.deliveriesCache![index] = updatedDelivery;
                    localStorage.setItem(this.deliveriesUrl, JSON.stringify(this.deliveriesCache));

                }

            })

        );

    }
    deleteDelivery(id: number): Observable<any> {

        const url = `${this.deliveryUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.deliveriesCache.findIndex(delivery => delivery.deliveryId === id);

                if (index !== -1) {

                    this.deliveriesCache.splice(index, 1);
                    localStorage.setItem(this.deliveriesUrl, JSON.stringify(this.deliveriesCache));

                }

            })
        );

    }


}