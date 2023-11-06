import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BillDetail } from '../interfaces/bill-detail';
@Injectable({
    providedIn: 'root'
})
export class BillDetailService {

    private billDetailsUrl = 'billDetailsUrl';
    private billDetailUrl = 'billDetailUrl';
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

        return this.apiService.request<BillDetail>('post', this.billDetailUrl, newBillDetail).pipe(

            tap((addedBillDetail: BillDetail) => {

                this.billDetailsCache.push(addedBillDetail);
                localStorage.setItem(this.billDetailUrl, JSON.stringify(this.billDetailsCache));

            })

        );

    }

    updateBillDetail(updatedBillDetail: BillDetail): Observable<any> {

        const url = `${this.billDetailUrl}/${updatedBillDetail.billDetailId}`;

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

    deleteBillDetail(id: number): Observable<any> {

        const url = `${this.billDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.billDetailsCache.findIndex(billDetail => billDetail.billDetailId === id);

                if (index !== -1) {

                    this.billDetailsCache.splice(index, 1);
                    localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));

                }

            })
        );

    }

}