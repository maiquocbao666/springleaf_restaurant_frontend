import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RestaurantTable } from '../interfaces/restaurant-table';
import { ToastService } from './toast.service';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ReservationService } from './reservation.service';

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
        sweetAlertService: ToastService,
        private reservationService: ReservationService,
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
        if (this.isNameInCache(newObject.tableName, newObject.tableId)) {
            return of();
        }
        return super.add(newObject);
    }

    override update(updatedObject: RestaurantTable): Observable<RestaurantTable> {
        if (this.isNameInCache(updatedObject.tableName, updatedObject.tableId)) {
            return of();
        }
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        if (!this.canDeleteTable(id)) {
            return of();
        }
        return super.delete(id);
    }

    //-------------------------------------------------------------------------------------------------------------------

    private isNameInCache(name: string, idToExclude: number | null = null): boolean {
        let isInCache = false;
        isInCache = this.cache.some(
            (item) => item.tableName.toLowerCase() === name.toLowerCase() && item.tableId !== idToExclude
        );
        if (isInCache) {
            this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã có rồi!`, '', 'error', 2000);
        }
        return isInCache;
    }

    resetAutoIncrement(): Observable<string> {
        return this.apiService.request<string>('post', 'reset/id', {});
    }

    findTableByStatusId(tableStatusId: string): boolean {
        return this.cache.some(restaurantTable => restaurantTable.tableStatusId === tableStatusId);
    }

    findTableNameByTableId(tableId: number): string {
        const table = this.cache.find(data => data.tableId === tableId);
        return table ? table.tableName : ''; // Return tableName if found, otherwise an empty string
    }

    getRestaurantIdByTableId(tableId: number): number | null {
        const table = this.cache.find(data => data.tableId === tableId);
        return table ? table.restaurantId : null; // Return tableName if found, otherwise an empty string
    }

    checkStatus(restaurantTableId: number): boolean {
        return true;
    }

    isTableIdInReservationCache(tableId: number): boolean {
        if (this.reservationService && this.reservationService.cache) {
            const isTableIdInCache = this.reservationService.cache.some(reservation =>
                reservation.restaurantTableId === tableId
            );
            return isTableIdInCache;
        }
        return false;
    }

    canDeleteTable(tableId: number): boolean {
        // Kiểm tra xem tableId có trong reservationCache hay không
        const isTableIdInReservationCache = this.isTableIdInReservationCache(tableId);

        // Nếu có, không cho phép xóa
        if (isTableIdInReservationCache) {
            this.sweetAlertService.showTimedAlert('Bàn đang được sử dụng trong đơn đặt bàn!', '', 'error', 2000);
            return false;
        }

        // Ngược lại, cho phép xóa
        return true;
    }

}