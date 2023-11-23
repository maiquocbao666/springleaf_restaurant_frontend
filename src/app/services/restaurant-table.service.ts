import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RestaurantTable } from '../interfaces/restaurant-table';

@Injectable({
    providedIn: 'root'
})
export class RestaurantTableService {

    private restaurantTablesUrl = 'restaurantTables';
    private restaurantTableUrl = 'restaurantTable';
    private restaurantTablesCacheSubject = new BehaviorSubject<RestaurantTable[]>([]);
    restaurantTablesCache$ = this.restaurantTablesCacheSubject.asObservable();

    constructor(
        private apiService: ApiService,
    ) { }

    get restaurantTablesCache(): RestaurantTable[] {
        return this.restaurantTablesCacheSubject.value;
    }

    set restaurantTablesCache(value: RestaurantTable[]) {
        this.restaurantTablesCacheSubject.next(value);
    }

    private updateCache(updatedRestaurantTable: RestaurantTable): void {
        const index = this.restaurantTablesCache.findIndex(table => table.tableId === updatedRestaurantTable.tableId);
        if (index !== -1) {
            const updatedCache = [...this.restaurantTablesCache];
            updatedCache[index] = updatedRestaurantTable;
            this.restaurantTablesCache = updatedCache;
        }
    }

    getRestaurantTables(): Observable<RestaurantTable[]> {

        if (this.restaurantTablesCache.length > 0) {
            return of(this.restaurantTablesCache);
        }

        const restaurantTablesObservable = this.apiService.request<RestaurantTable[]>('get', this.restaurantTablesUrl);

        restaurantTablesObservable.subscribe(data => {
            this.restaurantTablesCache = data;
        });

        return restaurantTablesObservable;
    }

    getRestaurantTableById(id: number): Observable<RestaurantTable | null> {

        if (!id) {
            return of(null);
        }

        if (!this.restaurantTablesCache.length) {

            this.getRestaurantTables();

        }

        const restaurantTableFromCache = this.restaurantTablesCache.find(restaurantTable => restaurantTable.tableId === id);

        if (restaurantTableFromCache) {

            return of(restaurantTableFromCache);

        } else {

            const url = `${this.restaurantTableUrl}/${id}`;
            return this.apiService.request<RestaurantTable>('get', url);

        }

    }

    private isRestaurantTableNameInCache(name: string): boolean {
        return !!this.restaurantTablesCache?.find(restaurantTable => restaurantTable.tableName.toLowerCase() === name.toLowerCase());
    }

    addRestaurantTable(newRestaurantTable: RestaurantTable): Observable<RestaurantTable> {

        if (this.isRestaurantTableNameInCache(newRestaurantTable.tableName)) {
            return of();
        }

        return this.apiService.request<RestaurantTable>('post', this.restaurantTableUrl, newRestaurantTable).pipe(
            tap((addedRestaurantTable: RestaurantTable) => {
                this.restaurantTablesCache = [...this.restaurantTablesCache, addedRestaurantTable];
            })
        );
    }

    updateRestaurantTable(updatedRestaurantTable: RestaurantTable): Observable<any> {

        if (this.isRestaurantTableNameInCache(updatedRestaurantTable.tableName)) {
            return of();
        }

        const url = `${this.restaurantTableUrl}`;

        return this.apiService.request('put', url, updatedRestaurantTable).pipe(
            tap(() => {
                this.updateCache(updatedRestaurantTable);
            })
        );
    }

    deleteRestaurantTable(id: number): Observable<any> {

        const url = `${this.restaurantTableUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.restaurantTablesCache.filter(restaurantTable => restaurantTable.tableId !== id);
                this.restaurantTablesCache = updatedCache;
            })
        );

    }

    updateRestaurantTableCache(updatedRestaurantTable: RestaurantTable): void {

        const index = this.restaurantTablesCache.findIndex(table => table.tableId === updatedRestaurantTable.tableId);

        if (index !== -1) {

            this.restaurantTablesCache[index] = updatedRestaurantTable;

        }
    }

    resetAutoIncrement(): Observable<string> {

        return this.apiService.request<string>('post', 'reset/id', {});

    }

    findTableByStatusId(tableStatusId: number): boolean {
        return this.restaurantTablesCache.some(restaurantTable => restaurantTable.tableStatusId === tableStatusId);
    }

    checkStatus(restaurantTableId: number): boolean {
        return true;
    }
}