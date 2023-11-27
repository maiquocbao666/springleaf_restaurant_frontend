import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { OrderThreshold } from './../interfaces/order-threshold';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class OrderThresholdService extends BaseService<OrderThreshold> {

    apisUrl = 'orderThresholds';
    cacheKey = 'orderThresholds';
    apiUrl = 'orderThreshold';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }

    override gets(): Observable<OrderThreshold[]> {
        return super.gets();
    }

    override add(newObject: OrderThreshold): Observable<OrderThreshold> {
        return super.add(newObject);
    }

    override update(updatedObject: OrderThreshold): Observable<OrderThreshold> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<OrderThreshold[]> {
        return super.searchByName(term);
    }

    override getItemId(item: OrderThreshold): number {
        return item.orderThresholdId!;
    }

    override getItemName(item: OrderThreshold): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "OrderThreshold";
    }

}
