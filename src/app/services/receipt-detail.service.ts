import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReceiptDetail } from '../interfaces/receipt-detail';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ReceiptDetailService extends BaseService<ReceiptDetail> {

    //--------------------------------------------------------------------------------------------------------------

    apisUrl = 'receiptDetails';
    cacheKey = 'receiptDetails';
    apiUrl = 'receiptDetail';

    //--------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //--------------------------------------------------------------------------------------------------------------

    getItemId(item: ReceiptDetail): number {
        return item.receiptDetailId!;
    }

    getItemName(item: ReceiptDetail): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "ReceiptDetail";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //--------------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: ReceiptDetail): Observable<ReceiptDetail> {
        return super.add(newObject);
    }

    override update(updatedObject: ReceiptDetail): Observable<ReceiptDetail> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //--------------------------------------------------------------------------------------------------------------

}
