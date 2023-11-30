import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RestaurantTable } from '../interfaces/restaurant-table';
import { ToastService } from './toast.service';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root'
})
export class RestaurantTableService extends BaseService<RestaurantTable>  {

    //-------------------------------------------------------------------------------------------------------------------

    apisUrl = 'restaurantTables';
    cacheKey = 'restaurantTables';
    apiUrl = 'restaurantTable';

    //-------------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //-------------------------------------------------------------------------------------------------------------------

    getItemId(item: RestaurantTable): number {
        return item.tableId!;
    }

    getItemName(item: RestaurantTable): string {
        return item.tableName;
    }

    getObjectName(): string {
        return "RestaurantTable";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //-------------------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }
    

    override add(newObject: RestaurantTable): Observable<RestaurantTable> {
        return super.add(newObject);
    }

    override update(updatedObject: RestaurantTable): Observable<RestaurantTable> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //-------------------------------------------------------------------------------------------------------------------

    // private isInCache(name: string, idToExclude: number | null = null): boolean {
    //     const isInCache = this.restaurantTablesCache?.some(
    //         (cache) =>
    //             cache.tableName.toLowerCase() === name.toLowerCase() && cache.tableId !== idToExclude
    //     );
    //     if (isInCache) {
    //         this.sweetAlertService.showTimedAlert('Nhà hàng này đã có rồi!', '', 'error', 2000);
    //     }
    //     return isInCache || false;
    // }

    resetAutoIncrement(): Observable<string> {
        return this.apiService.request<string>('post', 'reset/id', {});
    }

    findTableByStatusId(tableStatusId: number): boolean {
        return this.cache.some(restaurantTable => restaurantTable.tableStatusId === tableStatusId);
    }

    checkStatus(restaurantTableId: number): boolean {
        return true;
    }

}