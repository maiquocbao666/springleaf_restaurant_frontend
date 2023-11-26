import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MergeTable } from './../interfaces/merge-table';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class MergeTableService extends BaseService<MergeTable> {

    apisUrl = 'mergeTables';
    cacheKey = 'mergeTables';
    apiUrl = 'mergeTable';

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }


    override gets(): Observable<MergeTable[]> {
        return super.gets();
    }

    override getById(id: number): Observable<MergeTable | null> {
        return super.getById(id);
    }

    override add(newObject: MergeTable): Observable<MergeTable> {
        return super.add(newObject);
    }

    override update(updatedObject: MergeTable): Observable<MergeTable> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<MergeTable> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<MergeTable[]> {
        return super.searchByName(term);
    }

    override getItemId(item: MergeTable): number {
        return item.id!;
    }

    override getItemName(item: MergeTable): string {
        throw new Error('Method not implemented.');
    }

    override getObjectName(): string {
        return "MergeTable";
    }
}
