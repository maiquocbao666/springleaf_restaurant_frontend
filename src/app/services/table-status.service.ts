import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableStatus } from '../interfaces/table-status';

@Injectable({
    providedIn: 'root'
})
export class TableStatusService {

    private tableStatusesUrl = 'tableStatuses';
    private tableStatusUrl = 'tableStatus';
    private tableStatusesCacheSubject = new BehaviorSubject<TableStatus[]>([]);
    tableStatusesCache$ = this.tableStatusesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get tableStatusesCache(): TableStatus[] {
        return this.tableStatusesCacheSubject.value;
    }

    set tableStatusesCache(value: TableStatus[]) {
        this.tableStatusesCacheSubject.next(value);
    }

    gets(): Observable<TableStatus[]> {

        if (this.tableStatusesCache) {
            return of(this.tableStatusesCache);
        }

        const tableStatusesObservable = this.apiService.request<TableStatus[]>('get', this.tableStatusesUrl);

        tableStatusesObservable.subscribe(data => {
            this.tableStatusesCache = data;
        });

        return tableStatusesObservable;
    }

    private isInCache(name: string, idToExclude: number | null = null): boolean {
        const isTableStautsInCache = this.tableStatusesCache?.some(
            (cache) =>
                cache.tableStatusName.toLowerCase() === name.toLowerCase() && cache.tableStatusId !== idToExclude
        );

        if (isTableStautsInCache) {
            console.log("Table Status này đã có rồi");
        }

        return isTableStautsInCache || false;
    }

    add(newObject: TableStatus): Observable<TableStatus> {
        if (this.tableStatusesCache) {
            if (this.isInCache(newObject.tableStatusName)) {
                return of();
            }
        }
        return this.apiService.request<TableStatus>('post', this.tableStatusUrl, newObject).pipe(
            tap((added: TableStatus) => {
                this.tableStatusesCache = [...this.tableStatusesCache, added];
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    update(updatedObject: TableStatus): Observable<any> {
        if (this.tableStatusesCache) {
            // Kiểm tra xem danh sách tableStatusesCache đã được tải hay chưa
            if (this.isInCache(updatedObject.tableStatusName, updatedObject.tableStatusId)) {
                return of();
            }
        }

        const url = `${this.tableStatusUrl}`;

        return this.apiService.request('put', url, updatedObject).pipe(
            tap(() => {
                const updatedObjects = this.tableStatusesCache.map((cache) =>
                    cache.tableStatusId === updatedObject.tableStatusId ? updatedObject : cache
                );
                this.tableStatusesCache = updatedObjects;
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.tableStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                // Xóa tableStatus khỏi tableStatusesCache
                const updatedtableStatuses = this.tableStatusesCache.filter(cache => cache.tableStatusId !== id);
                this.tableStatusesCache = updatedtableStatuses;
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    getTableStatusById(id: number): Observable<TableStatus | null> {

        if (!id) {
            return of(null);
        }

        if (this.tableStatusesCache.length > 0) {
            const tableStatusFromCache = this.tableStatusesCache.find(tableStatus => tableStatus.tableStatusId === id);
            if (tableStatusFromCache) {
                return of(tableStatusFromCache);
            }
        }

        const url = `${this.tableStatusUrl}/${id}`;

        return this.apiService.request<TableStatus>('get', url).pipe(
            tap((tableStatus: TableStatus) => {
                // Update cache with the fetched table status
                this.tableStatusesCache = [...this.tableStatusesCache, tableStatus];
            }),
            // Handle error or return null if the table status is not found
            catchError(() => of(null))
        );
    }

}