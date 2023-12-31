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

    //------------------------------------------------------------------------------------------------------

    apisUrl = 'orderThresholds';
    cacheKey = 'orderThresholds';
    apiUrl = 'orderThreshold';

    //------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //------------------------------------------------------------------------------------------------------

    getItemId(item: OrderThreshold): number {
        return item.orderThresholdId!;
    }

    getItemName(item: OrderThreshold): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "OrderThreshold";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
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

    //------------------------------------------------------------------------------------------------------

}
