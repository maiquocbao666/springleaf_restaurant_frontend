import { BillDetail } from '../interfaces/bill-detail';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
@Injectable({
    providedIn: 'root'
})
export class BillDetailService {

    private billDetailsUrl = 'billDetails';
    billDetailsCache!: BillDetail[];

    constructor(private apiService: ApiService) { }

    getBillDetails(): Observable<BillDetail[]> {

        if (this.billDetailsCache) {

            return of(this.billDetailsCache);
            
        }

        const billDetailsObservable = this.apiService.request<BillDetail[]>('get', this.billDetailsUrl);

        billDetailsObservable.subscribe(data => {

            this.billDetailsCache = data;

        });

        return billDetailsObservable;
    }

    addBillDetail(newBillDetail: BillDetail): Observable<BillDetail> {

        return this.apiService.request<BillDetail>('post', this.billDetailsUrl, newBillDetail).pipe(

            tap((addedCategory: BillDetail) => {

                this.billDetailsCache.push(addedCategory);
                localStorage.setItem("categories", JSON.stringify(this.billDetailsCache));

            })

        );

    }

}