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

            tap((addedBillDetail: BillDetail) => {

                this.billDetailsCache.push(addedBillDetail);
                localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));

            })

        );

    }

    updateBillDetail(updatedBillDetail: BillDetail): Observable<any> {

        const url = `${this.billDetailsUrl}/${updatedBillDetail.billDetailId}`;

        return this.apiService.request('put', url, updatedBillDetail).pipe(

            tap(() => {

                const index = this.billDetailsCache!.findIndex(billDetail => billDetail.billDetailId === updatedBillDetail.billDetailId);

                if (index !== -1) {

                    this.billDetailsCache![index] = updatedBillDetail;
                    localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));

                }

            })

        );

    }

}