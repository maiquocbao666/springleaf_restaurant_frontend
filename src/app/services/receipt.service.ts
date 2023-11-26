import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Receipt } from '../interfaces/receipt';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ReceiptService extends BaseService<Receipt> {

    apisUrl = 'receipts';
    cacheKey = 'receipts';
    apiUrl = 'receipt';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

    override gets(): Observable<Receipt[]> {
        return super.gets();
    }

    override getById(id: number): Observable<Receipt | null> {
        return super.getById(id);
    }

    override add(newObject: Receipt): Observable<Receipt> {
        return super.add(newObject);
    }

    override update(updatedObject: Receipt): Observable<Receipt> {
        return super.update(updatedObject);
    }

    override delete(id : number): Observable<any> {
        return super.delete(id);
      }

    override searchByName(term: string): Observable<Receipt[]> {
        return super.searchByName(term);
    }

    override getItemId(item: Receipt): number {
        return item.receiptId!;
    }

    override getItemName(item: Receipt): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "Receipt";
    }
}
