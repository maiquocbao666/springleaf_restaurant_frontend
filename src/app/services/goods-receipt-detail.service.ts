import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GoodsReceiptDetail } from '../interfaces/goods-receipt-detail';


@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptDetailService {

  private goodsReceiptDetailsUrl = 'goodsReceiptDetails';
  private goodsReceiptDetailUrl = 'goodsReceiptDetail';
  goodsReceiptDetailsCache!: GoodsReceiptDetail[];

  constructor(private apiService: ApiService) { }

  getGoodsReceiptDetails(): Observable<GoodsReceiptDetail[]> {

    if (this.goodsReceiptDetailsCache) {

      return of(this.goodsReceiptDetailsCache);

    }

    const GoodsReceiptDetailsObservable = this.apiService.request<GoodsReceiptDetail[]>('get', this.goodsReceiptDetailsUrl);

    GoodsReceiptDetailsObservable.subscribe(data => {

      this.goodsReceiptDetailsCache = data;

    });

    return GoodsReceiptDetailsObservable;

  }

  addGoodsReceiptDetail(newGoodsReceiptDetail: GoodsReceiptDetail): Observable<GoodsReceiptDetail> {

    return this.apiService.request<GoodsReceiptDetail>('post', this.goodsReceiptDetailUrl, newGoodsReceiptDetail).pipe(

      tap((addedGoodsReceiptDetail: GoodsReceiptDetail) => {

        this.goodsReceiptDetailsCache.push(addedGoodsReceiptDetail);
        localStorage.setItem(this.goodsReceiptDetailsUrl, JSON.stringify(this.goodsReceiptDetailsCache));

      })

    );

  }

  updateGoodsReceiptDetail(updatedGoodsReceiptDetail: GoodsReceiptDetail): Observable<any> {

    const url = `${this.goodsReceiptDetailUrl}/${updatedGoodsReceiptDetail.goodsReceiptDetailId}`;

    return this.apiService.request('put', url, updatedGoodsReceiptDetail).pipe(

      tap(() => {

        const index = this.goodsReceiptDetailsCache!.findIndex(detail => detail.goodsReceiptDetailId === updatedGoodsReceiptDetail.goodsReceiptDetailId);

        if (index !== -1) {

          this.goodsReceiptDetailsCache![index] = updatedGoodsReceiptDetail;
          localStorage.setItem(this.goodsReceiptDetailsUrl, JSON.stringify(this.goodsReceiptDetailsCache));

        }

      })

    );

  }

  deleteGoodsReceiptDetail(id: number): Observable<any> {

    const url = `${this.goodsReceiptDetailUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(

      tap(() => {

        const index = this.goodsReceiptDetailsCache.findIndex(detail => detail.goodsReceiptDetailId === id);

        if (index !== -1) {

          this.goodsReceiptDetailsCache.splice(index, 1);
          localStorage.setItem(this.goodsReceiptDetailsUrl, JSON.stringify(this.goodsReceiptDetailsCache));

        }

      })
    );

  }



}