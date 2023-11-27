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

    apisUrl = 'tableStatuses';
    cacheKey = 'tableStatuses';
    apiUrl = 'tableStatus';


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }


    override gets(): Observable<TableStatus[]> {
        return super.gets();
    }

    override add(newObject: TableStatus): Observable<TableStatus> {
        return super.add(newObject);
    }

    override update(updatedObject: TableStatus): Observable<TableStatus> {
        return super.update(updatedObject);
    }

    override delete(id : number): Observable<any> {
        return super.delete(id);
      }

    override searchByName(term: string): Observable<TableStatus[]> {
        return super.searchByName(term);
    }

    override getItemId(item: TableStatus): number {
        return item.tableStatusId!;
    }

    override getItemName(item: TableStatus): string {
        return item.tableStatusName;
    }

    override getObjectName(): string {
        return "TableStatus";
    }

}
