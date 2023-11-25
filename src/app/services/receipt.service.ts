import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Receipt } from '../interfaces/receipt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReceiptService {

    private receiptsUrl = 'receipts';
    private receiptUrl = 'receipt';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private receiptsCacheSubject = new BehaviorSubject<Receipt[]>([]);
    receiptsCache$ = this.receiptsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get receiptsCache(): Receipt[] {
        return this.receiptsCacheSubject.value;
    }

    set receiptsCache(value: Receipt[]) {
        this.receiptsCacheSubject.next(value);
    }

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
                this.receiptsCache = [...this.receiptsCache, addedReceipt];
                localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));
            })
        );
    }

    updateReceipt(updatedReceipt: Receipt): Observable<any> {
        const url = `${this.receiptUrl}/${updatedReceipt.receiptId}`;

        return this.apiService.request('put', url, updatedReceipt).pipe(
            tap(() => {
                this.updateReceiptCache(updatedReceipt);
            })
        );
    }

    deleteReceipt(id: number): Observable<any> {
        const url = `${this.receiptUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                this.receiptsCache = this.receiptsCache.filter(receipt => receipt.receiptId !== id);
                localStorage.setItem(this.receiptsUrl, JSON.stringify(this.receiptsCache));
            })
        );
    }

    updateReceiptCache(updatedReceipt: Receipt): void {
        if (this.receiptsCache) {
            const index = this.receiptsCache.findIndex(receipt => receipt.receiptId === updatedReceipt.receiptId);

            if (index !== -1) {
                this.receiptsCache[index] = updatedReceipt;
            }
        }
    }

}