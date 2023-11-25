import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReceiptDetail } from '../interfaces/receipt-detail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReceiptDetailService {

    private receiptDetailsUrl = 'receiptDetails';
    private receiptDetailUrl = 'receiptDetail';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private receiptDetailsCacheSubject = new BehaviorSubject<ReceiptDetail[]>([]);
    receiptDetailsCache$ = this.receiptDetailsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get receiptDetailsCache(): ReceiptDetail[] {
        return this.receiptDetailsCacheSubject.value;
    }

    set receiptDetailsCache(value: ReceiptDetail[]) {
        this.receiptDetailsCacheSubject.next(value);
    }

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
                this.receiptDetailsCache = [...this.receiptDetailsCache, addedReceiptDetail];
                localStorage.setItem(this.receiptDetailsUrl, JSON.stringify(this.receiptDetailsCache));
            })
        );
    }

    updateReceiptDetail(updatedReceiptDetail: ReceiptDetail): Observable<any> {
        const url = `${this.receiptDetailUrl}/${updatedReceiptDetail.receiptDetailId}`;

        return this.apiService.request('put', url, updatedReceiptDetail).pipe(
            tap(() => {
                this.updateReceiptDetailCache(updatedReceiptDetail);
            })
        );
    }

    deleteReceiptDetail(id: number): Observable<any> {
        const url = `${this.receiptDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                this.receiptDetailsCache = this.receiptDetailsCache.filter(receiptDetail => receiptDetail.receiptDetailId !== id);
                localStorage.setItem(this.receiptDetailsUrl, JSON.stringify(this.receiptDetailsCache));
            })
        );
    }

    updateReceiptDetailCache(updatedReceiptDetail: ReceiptDetail): void {
        if (this.receiptDetailsCache) {
            const index = this.receiptDetailsCache.findIndex(receiptDetail => receiptDetail.receiptDetailId === updatedReceiptDetail.receiptDetailId);

            if (index !== -1) {
                this.receiptDetailsCache[index] = updatedReceiptDetail;
            }
        }
    }

}