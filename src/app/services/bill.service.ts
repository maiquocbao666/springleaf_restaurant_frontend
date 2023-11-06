import { Bill } from '../interfaces/bill';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class BillService {

    private billsUrl = 'bills';
    billsCache!: Bill[];

    constructor(private apiService: ApiService) { }


    getBills(): Observable<Bill[]> {

        if (this.billsCache) {

            return of(this.billsCache);

        }

        const billsObservable = this.apiService.request<Bill[]>('get', this.billsUrl);


        billsObservable.subscribe(data => {

            this.billsCache = data;

        });

        return billsObservable;

    }

    addBill(newBill: Bill): Observable<Bill> {

        return this.apiService.request<Bill>('post', this.billsUrl, newBill).pipe(

            tap((addedBill: Bill) => {

                this.billsCache.push(addedBill);
                localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));

            })

        );

    }

}