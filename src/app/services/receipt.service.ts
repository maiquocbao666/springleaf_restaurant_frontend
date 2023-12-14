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

    //-------------------------------------------------------------------------------------------------------

    apisUrl = 'receipts';
    cacheKey = 'receipts';
    apiUrl = 'receipt';

    //-------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //-------------------------------------------------------------------------------------------------------

    getItemId(item: Receipt): number {
        return item.receiptId!;
    }

    getItemName(item: Receipt): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "Receipt";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //-------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: Receipt): Observable<Receipt> {
        return super.add(newObject);
    }

    override update(updatedObject: Receipt): Observable<Receipt> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<Receipt[]> {
        return super.searchByName(term);
    }

    override sortEntities(entities: Receipt[], field: keyof Receipt, ascending: boolean): Observable<Receipt[]> {
        return super.sortEntities(entities, field, ascending);
    }

    //-------------------------------------------------------------------------------------------------------

}
