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

    getTableStatusById(id: number): Observable<TableStatus> {

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

    addTableStatus(newTableStatus: TableStatus): Observable<TableStatus> {

        return this.apiService.request<TableStatus>('post', this.tableStatusUrl, newTableStatus).pipe(

            tap((addedTableStatus: TableStatus) => {

                this.tableStatusesCache.push(addedTableStatus);
                localStorage.setItem("tableStatuses", JSON.stringify(this.tableStatusesCache));

            })

        );

    }

}