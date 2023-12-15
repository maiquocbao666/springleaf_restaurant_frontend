import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableStatus } from '../interfaces/table-status';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class TableStatusService extends BaseService<TableStatus> {

    //----------------------------------------------------------------------------------------------------------------

    apisUrl = 'tableStatuses';
    cacheKey = 'tableStatuses';
    apiUrl = 'tableStatus';

    //----------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //----------------------------------------------------------------------------------------------------------------

    getItemId(item: TableStatus): number {
        return item.tableStatusId!;
    }

    getItemName(item: TableStatus): string {
        return item.tableStatusName;
    }

    getObjectName(): string {
        return "TableStatus";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //----------------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: TableStatus): Observable<TableStatus> {
        return super.add(newObject);
    }

    override update(updatedObject: TableStatus): Observable<TableStatus> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    //----------------------------------------------------------------------------------------------------------------

}
