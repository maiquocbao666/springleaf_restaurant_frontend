import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReceiptDetail } from '../interfaces/receipt-detail';


@Injectable({
    providedIn: 'root'
})
export class ReceiptDetailService {

    private receiptDetailsUrl = 'restaurants';
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



}