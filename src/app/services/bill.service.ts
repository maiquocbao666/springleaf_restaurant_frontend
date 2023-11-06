import { Bill } from '../interfaces/bill';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Injectable({
    providedIn: 'root'
})
export class BillService {

    private billsUrl = 'billsUrl';
    private billUrl = 'billUrl';
    
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

        return this.apiService.request<Bill>('post', this.billUrl, newBill).pipe(

            tap((addedBill: Bill) => {

                this.billsCache.push(addedBill);
                localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));

            })

        );

    }

    updateBill(updatedBill: Bill): Observable<any> {

        const url = `${this.billUrl}/${updatedBill.billId}`;

        return this.apiService.request('put', url, updatedBill).pipe(

            tap(() => {

                const index = this.billsCache!.findIndex(bill => bill.billId === updatedBill.billId);

                if (index !== -1) {

                    this.billsCache![index] = updatedBill;
                    localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));

                }

            })

        );

    }

    deletebill(id: number): Observable<any> {

        const url = `${this.billUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.billsCache.findIndex(bill => bill.billId === id);

                if (index !== -1) {

                    this.billsCache.splice(index, 1);
                    localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));

                }

            })
        );

    }

}