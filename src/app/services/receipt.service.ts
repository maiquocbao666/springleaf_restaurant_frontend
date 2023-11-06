import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Receipt } from '../interfaces/receipt';


@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    private receiptsUrl = 'receiptsUrl';
    private receiptUrl = 'receiptUrl';
    receiptsCache!: Receipt[];

    constructor(private apiService: ApiService) { }

    getReceipts(): Observable<Receipt[]> {

        if (this.receiptsCache) {

            return of(this.receiptsCache);

        }

        const receiptsObservable = this.apiService.request<Receipt[]>('get', this.receiptsUrl);


        receiptsObservable.subscribe(data => {

            this.receiptsCache = data;

        });

        return receiptsObservable;

    }

    addReceipt(newReceipt: Receipt): Observable<Receipt> {

        return this.apiService.request<Receipt>('post', this.receiptUrl, newReceipt).pipe(

            tap((addedReceipt: Receipt) => {

                this.receiptsCache.push(addedReceipt);
                localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));

            })

        );

    }

    updateReceipt(updatedReceipt: Receipt): Observable<any> {

        const url = `${this.receiptUrl}/${updatedReceipt.receiptId}`;

        return this.apiService.request('put', url, updatedReceipt).pipe(

            tap(() => {

                const index = this.receiptsCache!.findIndex(receipt => receipt.receiptId === updatedReceipt.receiptId);

                if (index !== -1) {

                    this.receiptsCache![index] = updatedReceipt;
                    localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));

                }

            })

        );

    }

    deleteReceipt(id: number): Observable<any> {

        const url = `${this.receiptUrl}/${id}`;
    
        return this.apiService.request('delete', url).pipe(
    
            tap(() => {
    
                const index = this.receiptsCache.findIndex(receipt => receipt.receiptId === id);
    
                if (index !== -1) {
    
                    this.receiptsCache.splice(index, 1);
                    localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));
    
                }
    
            })
        );
    
    }
    

}