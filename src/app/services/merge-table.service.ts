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

    //----------------------------------------------------------------------------------------------------

    apisUrl = 'mergeTables';
    cacheKey = 'mergeTables';
    apiUrl = 'mergeTable';

    //----------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //----------------------------------------------------------------------------------------------------

    getItemId(item: MergeTable): number {
        return item.id!;
    }

    getItemName(item: MergeTable): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "MergeTable";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //----------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: MergeTable): Observable<MergeTable> {
        return super.add(newObject);
    }

    override update(updatedObject: MergeTable): Observable<MergeTable> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<MergeTable[]> {
        return super.searchByName(term);
    }

    getUniqueMergeTableIds(): string[] {
        if (!this.cache) {
            return [];
        }

        // Lọc ra các mergeTableId không trùng lặp
        const uniqueMergeTableIds = this.cache
            .map(mergeTable => mergeTable.mergeTableId)
            .filter((mergeTableId, index, array) => array.indexOf(mergeTableId) === index);

        return uniqueMergeTableIds;
    }

    tableExistsInCache(tableId: number, mergeTableId: string): boolean {
        if (!this.cache) {
            return false;
        }

        const foundElement = this.cache.find(mergeTable =>
            mergeTable.tableId === tableId &&
            mergeTable.mergeTableId === mergeTableId &&
            (mergeTable.status === "Đang chờ xác nhận" || mergeTable.status === "Xác nhận đã gộp")
        );

        return foundElement !== undefined;
    }

    getMergeTableWithTableIdExistsInCache(tableId: number): string {
        if (!this.cache) {
            return '';
        }
    
        const foundElement = this.cache.find(mergeTable =>
            mergeTable.tableId === tableId &&
            (mergeTable.status === "Đang chờ xác nhận" || mergeTable.status === "Xác nhận đã gộp")
        );
    
        return foundElement?.mergeTableId || '';
    }

}
