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

    apisUrl = 'receiptDetails';
    cacheKey = 'receiptDetails';
    apiUrl = 'receiptDetail';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

    override gets(): Observable<ReceiptDetail[]> {
        return super.gets();
    }

    override add(newObject: ReceiptDetail): Observable<ReceiptDetail> {
        return super.add(newObject);
    }

    override update(updatedObject: ReceiptDetail): Observable<ReceiptDetail> {
        return super.update(updatedObject);
    }

    override delete(id : number): Observable<any> {
        return super.delete(id);
      }

    override searchByName(term: string): Observable<ReceiptDetail[]> {
        return super.searchByName(term);
    }

    override getItemId(item: ReceiptDetail): number {
        return item.receiptDetailId!;
    }

    override getItemName(item: ReceiptDetail): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "ReceiptDetail";
    }

}
