import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReceiptDetail } from '../interfaces/receipt-detail';


@Injectable({
    providedIn: 'root'
})
export class ReceiptDetailService {

    private receiptDetailsUrl = 'receiptDetailsUrl';
    private receiptDetailUrl = 'receiptDetailUrl';
    receiptDetailsCache!: ReceiptDetail[];

    constructor(private apiService: ApiService) { }


    getReceiptDetails(): Observable<ReceiptDetail[]> {

        if (this.receiptDetailsCache) {

            return of(this.receiptDetailsCache);

        }

        const receiptDetailsObservable = this.apiService.request<ReceiptDetail[]>('get', this.receiptDetailsUrl);


        receiptDetailsObservable.subscribe(data => {

            this.receiptDetailsCache = data;

        });

        return receiptDetailsObservable;

    }

    addReceiptDetail(newReceiptDetail: ReceiptDetail): Observable<ReceiptDetail> {

        return this.apiService.request<ReceiptDetail>('post', this.receiptDetailUrl, newReceiptDetail).pipe(

            tap((addedReceiptDetail: ReceiptDetail) => {

                this.receiptDetailsCache.push(addedReceiptDetail);
                localStorage.setItem(this.receiptDetailsUrl, JSON.stringify(this.receiptDetailsCache));

            })

        );

    }

    updateReceiptDetail(updatedReceiptDetail: ReceiptDetail): Observable<any> {

        const url = `${this.receiptDetailUrl}/${updatedReceiptDetail.receiptDetailId}`;

        return this.apiService.request('put', url, updatedReceiptDetail).pipe(

            tap(() => {

                const index = this.receiptDetailsCache!.findIndex(receiptDetail => receiptDetail.receiptDetailId === updatedReceiptDetail.receiptDetailId);

                if (index !== -1) {

                    this.receiptDetailsCache![index] = updatedReceiptDetail;
                    localStorage.setItem(this.receiptDetailsUrl, JSON.stringify(this.receiptDetailsCache));

                }

            })

        );

    }

    deleteReceiptDetail(id: number): Observable<any> {

        const url = `${this.receiptDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.receiptDetailsCache.findIndex(receiptDetail => receiptDetail.receiptDetailId === id);

                if (index !== -1) {

                    this.receiptDetailsCache.splice(index, 1);
                    localStorage.setItem(this.receiptDetailsUrl, JSON.stringify(this.receiptDetailsCache));

                }

            })
        );

    }

}