import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GoodsReceiptDetail } from '../interfaces/goods-receipt-detail';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptDetailService extends BaseService<GoodsReceiptDetail>  {

  apisUrl = 'goodsReceiptDetailss';
  cacheKey = 'goodsReceiptDetailss';
  apiUrl = 'goodsReceiptDetails';

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  override gets(): Observable<GoodsReceiptDetail[]> {
    return super.gets();
  }
  override add(newGoodsReceiptDetail: GoodsReceiptDetail): Observable<GoodsReceiptDetail> {
    return super.add(newGoodsReceiptDetail);
  }
  override update(updated: GoodsReceiptDetail): Observable<GoodsReceiptDetail> {
    return super.update(updated);
  }
  override delete(id: number): Observable<GoodsReceiptDetail> {
    return super.delete(id);
  }
  override getItemId(item: GoodsReceiptDetail): number {
    return item.goodsReceiptDetailId!;
  }
  override getItemName(item: GoodsReceiptDetail): string {
    throw new Error('Method not implemented.');
  }
  override getObjectName(): string {
    return "GoodsReceiptDetail";
  }
}
