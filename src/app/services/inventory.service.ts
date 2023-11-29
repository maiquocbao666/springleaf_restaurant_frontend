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

    apisUrl = 'inventories';
    cacheKey = 'inventories';
    apiUrl = 'inventory';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }


    

    override gets(): Observable<Inventory[]> {
        return super.gets();
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

    override searchByName(term: string): Observable<Inventory[]> {
        return super.searchByName(term);
    }

    override getItemId(item: Inventory): number {
        return item.inventoryId!;
    }

    override getItemName(item: Inventory): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "Inventory";
    }

}
