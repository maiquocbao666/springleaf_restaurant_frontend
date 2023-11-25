import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GoodsReceipt } from '../interfaces/goods-receipt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoodsReceiptService {

    private goodsReceiptsUrl = 'goodsReceipts';
    private goodsReceiptUrl = 'goodsReceipt';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private goodsReceiptsCacheSubject = new BehaviorSubject<GoodsReceipt[]>([]);
    goodsReceiptsCache$ = this.goodsReceiptsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get goodsReceiptsCache(): GoodsReceipt[] {
        return this.goodsReceiptsCacheSubject.value;
    }

    set goodsReceiptsCache(value: GoodsReceipt[]) {
        this.goodsReceiptsCacheSubject.next(value);
    }

    gets(): Observable<GoodsReceipt[]> {

        if (this.goodsReceiptsCache) {
            return of(this.goodsReceiptsCache);
        }

        const goodsReceiptsObservable = this.apiService.request<GoodsReceipt[]>('get', this.goodsReceiptsUrl);

        goodsReceiptsObservable.subscribe(data => {
            this.goodsReceiptsCache = data;
        });

        return goodsReceiptsObservable;

    }

    add(newGoodsReceipt: GoodsReceipt): Observable<GoodsReceipt> {

        return this.apiService.request<GoodsReceipt>('post', this.goodsReceiptUrl, newGoodsReceipt).pipe(

            tap((addedGoodsReceipt: GoodsReceipt) => {

                this.goodsReceiptsCache = [...this.goodsReceiptsCache, addedGoodsReceipt];
                localStorage.setItem(this.goodsReceiptsUrl, JSON.stringify(this.goodsReceiptsCache));

            })

        );

    }

    update(updatedGoodsReceipt: GoodsReceipt): Observable<any> {

        const url = `${this.goodsReceiptUrl}/${updatedGoodsReceipt.goodsReceiptId}`;

        return this.apiService.request('put', url, updatedGoodsReceipt).pipe(

            tap(() => {

                const index = this.goodsReceiptsCache!.findIndex(goodsReceipt => goodsReceipt.goodsReceiptId === updatedGoodsReceipt.goodsReceiptId);

                if (index !== -1) {

                    this.goodsReceiptsCache![index] = updatedGoodsReceipt;
                    localStorage.setItem(this.goodsReceiptsUrl, JSON.stringify(this.goodsReceiptsCache));

                }

            })

        );

    }

    delete(id: number): Observable<any> {

        const url = `${this.goodsReceiptUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.goodsReceiptsCache.findIndex(goodsReceipt => goodsReceipt.goodsReceiptId === id);

                if (index !== -1) {

                    this.goodsReceiptsCache.splice(index, 1);
                    localStorage.setItem(this.goodsReceiptsUrl, JSON.stringify(this.goodsReceiptsCache));

                }

            })
        );

    }

    updateCache(updatedGoodsReceipt: GoodsReceipt): void {

        if (this.goodsReceiptsCache) {

            const index = this.goodsReceiptsCache.findIndex(goodsReceipt => goodsReceipt.goodsReceiptId === updatedGoodsReceipt.goodsReceiptId);

            if (index !== -1) {

                this.goodsReceiptsCache[index] = updatedGoodsReceipt;

            }
        }

    }

}