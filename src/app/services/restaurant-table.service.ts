import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RestaurantTable } from '../interfaces/restaurant-table';
import { ToastService } from './toast.service';

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
        private sweetAlertService: ToastService,
    ) { }

    get restaurantTablesCache(): RestaurantTable[] {
        return this.restaurantTablesCacheSubject.value;
    }

    set restaurantTablesCache(value: RestaurantTable[]) {
        this.restaurantTablesCacheSubject.next(value);
    }

    gets(): Observable<RestaurantTable[]> {
        if (this.restaurantTablesCache) {
            return of(this.restaurantTablesCache);
        }
        const observable = this.apiService.request<RestaurantTable[]>('get', this.restaurantTablesUrl);
        observable.subscribe(data => {
            this.restaurantTablesCache = data;
        });
        return observable;
    }

    getById(id: number): Observable<RestaurantTable | null> {
        if (!id) {
            return of(null);
        }
        if (!this.restaurantTablesCache.length) {
            this.gets();
        }
        const restaurantTableFromCache = this.restaurantTablesCache.find(restaurantTable => restaurantTable.tableId === id);
        if (restaurantTableFromCache) {
            return of(restaurantTableFromCache);
        } else {
            const url = `${this.restaurantTableUrl}/${id}`;
            return this.apiService.request<RestaurantTable>('get', url);
        }
    }

    private isInCache(name: string, idToExclude: number | null = null): boolean {
        const isInCache = this.restaurantTablesCache?.some(
            (cache) =>
                cache.tableName.toLowerCase() === name.toLowerCase() && cache.tableId !== idToExclude
        );
        if (isInCache) {
            this.sweetAlertService.showTimedAlert('Nhà hàng này đã có rồi!', '', 'error', 2000);
        }
        return isInCache || false;
    }

    add(newRestaurantTable: RestaurantTable): Observable<RestaurantTable> {
        if (this.restaurantTablesCache) {
            if (this.isInCache(newRestaurantTable.tableName)) {
                return of();
            }
        }
        return this.apiService.request<RestaurantTable>('post', this.restaurantTableUrl, newRestaurantTable).pipe(
            tap((added: RestaurantTable) => {
                this.restaurantTablesCache = [...this.restaurantTablesCache, added];
                localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));
            })
        );
    }

    update(updated: RestaurantTable): Observable<any> {
        if (this.restaurantTablesCache) {
            if (this.isInCache(updated.tableName, updated.restaurantId)) {
                return of();
            }
        }
        const url = `${this.restaurantTablesUrl}`;
        return this.apiService.request('put', url, updated).pipe(
            tap(() => {
                const updatedrestaurantTables = this.restaurantTablesCache.map((cache) =>
                    cache.tableId === updated.tableId ? updated : cache
                );
                this.restaurantTablesCache = updatedrestaurantTables;
                localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.restaurantTableUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updated = this.restaurantTablesCache.filter(cache => cache.tableId !== id);
                this.restaurantTablesCache = updated;
                localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));
            })
        );
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