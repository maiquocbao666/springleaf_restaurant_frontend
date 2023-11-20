import { TableStatus } from '../interfaces/table-status';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';



@Injectable({
    providedIn: 'root'
})
export class TableStatusService {

    private tableStatusesUrl = 'tableStatuses';
    private tableStatusUrl = 'tableStatus';

    tableStatusesCache!: TableStatus[];
    constructor(private apiService: ApiService) { }


    getTableStatuses(): Observable<TableStatus[]> {

        if (this.tableStatusesCache) {

            return of(this.tableStatusesCache);

        }

        const tableStatusesObservable = this.apiService.request<TableStatus[]>('get', this.tableStatusesUrl);

        tableStatusesObservable.subscribe(data => {

            this.tableStatusesCache = data;

        });

        return tableStatusesObservable;
    }

    getTableStatusById(id: number): Observable<TableStatus | null> {

        if(!id){
            return of(null);
        }

        if (!this.tableStatusesCache) {

            this.getTableStatuses();

        }

        const tableStatusFromCache = this.tableStatusesCache.find(tableStatus => tableStatus.tableStatusId === id);

        if (tableStatusFromCache) {

            return of(tableStatusFromCache);

        } else {

            const url = `${this.tableStatusUrl}/${id}`;
            return this.apiService.request<TableStatus>('get', url);

        }
    }

    private isTableStatusNameInCache(name: string): boolean {
        const isTrue = !!this.tableStatusesCache?.find(tableStatus => tableStatus.tableStatusName.toLowerCase() === name.toLowerCase());
        if (isTrue) {
            console.log('Trạng thái bàn này đã tồn tại trong cache.');
            return isTrue;
        } else {
            return isTrue;
        }

    }

    addTableStatus(newTableStatus: TableStatus): Observable<TableStatus> {
    
        if (this.isTableStatusNameInCache(newTableStatus.tableStatusName)) {
            // Nếu đã có table status có tên tương tự, trả về Observable với giá trị hiện tại  
            return of();
        }
    
        // Nếu không có table status có tên tương tự trong cache, tiếp tục thêm table status mới
        return this.apiService.request<TableStatus>('post', this.tableStatusUrl, newTableStatus).pipe(
            tap((addedTableStatus: TableStatus) => {
                this.tableStatusesCache.push(addedTableStatus);
                localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));
            })
        );
    }

    updateTableStatus(updatedtableStatus: TableStatus): Observable<any> {

        if (this.isTableStatusNameInCache(updatedtableStatus.tableStatusName)) {
            // Nếu đã có table status có tên tương tự, trả về Observable với giá trị hiện tại  
            return of();
        }

        const url = `${this.tableStatusUrl}`;

        return this.apiService.request('put', url, updatedtableStatus).pipe(

            tap(() => {

                const index = this.tableStatusesCache!.findIndex(tableStatus => tableStatus.tableStatusId === updatedtableStatus.tableStatusId);

                if (index !== -1) {

                    this.tableStatusesCache![index] = updatedtableStatus;
                    localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));

                }

            })

        );

    }

    deleteTableStatus(id: number): Observable<any> {

        const url = `${this.tableStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.tableStatusesCache.findIndex(tableStatus => tableStatus.tableStatusId === id);

                if (index !== -1) {

                    this.tableStatusesCache.splice(index, 1);
                    localStorage.setItem(this.tableStatusesUrl, JSON.stringify(this.tableStatusesCache));

                }

            })
        );

    }
    updateTableStatusesCache(updatedTableStatus: TableStatus): void {

        if (this.tableStatusesCache) {

            const index = this.tableStatusesCache.findIndex(tableStatus => tableStatus.tableStatusId === updatedTableStatus.tableStatusId);

            if (index !== -1) {

                this.tableStatusesCache[index] = updatedTableStatus;

            }
        }
    }
}