import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { GoodsReceipt } from '../interfaces/goods-receipt';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class GoodsReceiptService extends BaseService<GoodsReceipt> {

    apisUrl = 'goodsReceipts';
    cacheKey = 'goodsReceipts';
    apiUrl = 'goodsReceipt';

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

    override gets(): Observable<any[]> {
        return super.gets();
    }
    override getById(id: number): Observable<GoodsReceipt | null> {
        return super.getById(id);
    }
    override add(newObject: GoodsReceipt): Observable<GoodsReceipt> {
        return super.add(newObject);
    }
    override update(updatedObject: GoodsReceipt): Observable<GoodsReceipt> {
        return super.update(updatedObject);
    }
    override delete(id : number): Observable<any> {
        return super.delete(id);
      }
    override searchByName(term: string): Observable<GoodsReceipt[]> {
        return super.searchByName(term);
    }
    override getItemId(item: GoodsReceipt): number {
        return item.goodsReceiptId!;
    }
    override getItemName(item: GoodsReceipt): string {
        throw new Error('Method not implemented.');
    }
    override getObjectName(): string {
        return "GoodsReceipt";
    }


}