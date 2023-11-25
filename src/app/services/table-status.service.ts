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

    private updateCache(updatedTableStatus: TableStatus): void {
        const index = this.tableStatusesCache.findIndex(tableStatus => tableStatus.tableStatusId === updatedTableStatus.tableStatusId);
        if (index !== -1) {
            const updatedCache = [...this.tableStatusesCache];
            updatedCache[index] = updatedTableStatus;
            this.tableStatusesCache = updatedCache;
        }
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

    private isTableStatusNameInCache(name: string, tableStatusIdToExclude: number | null = null): boolean {
        const isTableStautsInCache = this.tableStatusesCache?.some(
          (cache) =>
            cache.tableStatusName.toLowerCase() === name.toLowerCase() && cache.tableStatusId !== tableStatusIdToExclude
        );
    
        if (isTableStautsInCache) {
          console.log("Danh mục này đã có rồi");
        }
    
        return isTableStautsInCache || false;
      }

    add(newTableStatus: TableStatus): Observable<TableStatus> {

        if (this.isTableStatusNameInCache(newTableStatus.tableStatusName)) {
            return of();
        }

        return this.apiService.request<TableStatus>('post', this.tableStatusUrl, newTableStatus).pipe(
            tap((addedTableStatus: TableStatus) => {
                this.tableStatusesCache = [...this.tableStatusesCache, addedTableStatus];
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    update(updatedTableStatus: TableStatus): Observable<any> {

        if (this.isTableStatusNameInCache(updatedTableStatus.tableStatusName)) {
            return of();
        }

        const url = `${this.tableStatusUrl}/${updatedTableStatus.tableStatusId}`;

        return this.apiService.request('put', url, updatedTableStatus).pipe(
            tap(() => {
                this.updateCache(updatedTableStatus);
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    delete(id: number): Observable<any> {

        const url = `${this.tableStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.tableStatusesCache.filter(tableStatus => tableStatus.tableStatusId !== id);
                this.tableStatusesCache = updatedCache;
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