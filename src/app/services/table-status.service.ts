import { TableStatus } from '../interfaces/table-status';

import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';



@Injectable({
    providedIn: 'root'
})
export class TableStatusService {

    private tableStatusesUrl = 'tableStatuses';
    private tableStatusUrl = 'tableStatus';
    tableStatusesCache!: TableStatus[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getTableStatuses(): Observable<TableStatus[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.tableStatusesCache) {
            return of(this.tableStatusesCache);
        }

        const tableStatusesObservable = this.apiService.request<TableStatus[]>('get', this.tableStatusesUrl);

        // Cache the categories observable
        tableStatusesObservable.subscribe(data => {
            this.tableStatusesCache = data; // Store the fetched data in the cache
        });

        return tableStatusesObservable;
    }

    // Lấy sản phẩm theo ID
    getTableStatusById(id: number): Observable<TableStatus> {
        // Check if categoriesCache is null or empty
        if (!this.tableStatusesCache) {
            // Fetch the data from the API if cache is empty
           this.getTableStatuses();
        }

        // Try to find the Category in the cache by its id
        const tableStatusFromCache = this.tableStatusesCache.find(tableStatus => tableStatus.tableStatusId === id);

        if (tableStatusFromCache) {
            // If found in cache, return it as an observable
            return of(tableStatusFromCache);
        } else {
            // If not found in cache, fetch it from the API
            const url = `${this.tableStatusUrl}/${id}`;
            return this.apiService.request<TableStatus>('get', url);
        }
    }

}