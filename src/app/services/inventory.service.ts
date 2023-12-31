import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inventory } from 'src/app/interfaces/inventory';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryService extends BaseService<Inventory> {

    //-----------------------------------------------------------------------------------------------------

    apisUrl = 'inventories';
    cacheKey = 'inventories';
    apiUrl = 'inventory';

    //-----------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //-----------------------------------------------------------------------------------------------------

    override getItemId(item: Inventory): number {
        return item.inventoryId!;
    }

    override getItemName(item: Inventory): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "Inventory";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //-----------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: Inventory): Observable<Inventory> {
        return super.add(newObject);
    }

    override update(updatedObject: Inventory): Observable<Inventory> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //-----------------------------------------------------------------------------------------------------

}
