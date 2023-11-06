import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Receipt } from '../interfaces/receipt';


@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    private receiptsUrl = 'restaurants';
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

        return this.apiService.request<Receipt>('post', this.receiptsUrl, newReceipt).pipe(

            tap((addedReceipt: Receipt) => {

                this.receiptsCache.push(addedReceipt);
                localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));

            })

        );

    }

}