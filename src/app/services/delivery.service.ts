
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Combo } from '../interfaces/combo';
import { Delivery } from '../interfaces/delivery';


@Injectable({
    providedIn: 'root'
})
export class DeliveryService {

    private deliveriesUrl = 'deliveries';
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



}