
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GoodsReceipt } from '../interfaces/goods-receipt';


@Injectable({
    providedIn: 'root'
})
export class GoodsReceiptService {

    private goodsReceiptsUrl = 'goodsReceipts';
    private goodsReceiptUrl = 'goodsReceipt';
    goodsReceiptsCache!: GoodsReceipt[];

    constructor(private apiService: ApiService) { }


    getGoodsReceipts(): Observable<GoodsReceipt[]> {

        if (this.goodsReceiptsCache) {

            return of(this.goodsReceiptsCache);

        }

        const goodsReceiptsObservable = this.apiService.request<GoodsReceipt[]>('get', this.goodsReceiptsUrl);


        goodsReceiptsObservable.subscribe(data => {

            this.goodsReceiptsCache = data;

        });

        return goodsReceiptsObservable;

    }





    addGoodsReceipt(newGoodsReceipt: GoodsReceipt): Observable<GoodsReceipt> {

        return this.apiService.request<GoodsReceipt>('post', this.goodsReceiptUrl, newGoodsReceipt).pipe(

            tap((addedGoodsReceipt: GoodsReceipt) => {

                this.goodsReceiptsCache.push(addedGoodsReceipt);
                localStorage.setItem(this.goodsReceiptsUrl, JSON.stringify(this.goodsReceiptsCache));

            })

        );

    }

    updateGoodsReceipt(updatedgoodsReceipt: GoodsReceipt): Observable<any> {

        const url = `${this.goodsReceiptUrl}/${updatedgoodsReceipt.goodsReceiptId}`;

        return this.apiService.request('put', url, updatedgoodsReceipt).pipe(

            tap(() => {

                const index = this.goodsReceiptsCache!.findIndex(goodsReceipt => goodsReceipt.goodsReceiptId === updatedgoodsReceipt.goodsReceiptId);

                if (index !== -1) {

                    this.goodsReceiptsCache![index] = updatedgoodsReceipt;
                    localStorage.setItem(this.goodsReceiptsUrl, JSON.stringify(this.goodsReceiptsCache));

                }

            })

        );

    }
    deleteGoodsReceipt(id: number): Observable<any> {

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

    updateGoodsReceiptCache(updatedGoodsReceipt: GoodsReceipt): void {

        if (this.goodsReceiptsCache) {

            const index = this.goodsReceiptsCache.findIndex(goodsReceipt => goodsReceipt.goodsReceiptId === updatedGoodsReceipt.goodsReceiptId);

            if (index !== -1) {

                this.goodsReceiptsCache[index] = updatedGoodsReceipt;

            }
        }

    }
}