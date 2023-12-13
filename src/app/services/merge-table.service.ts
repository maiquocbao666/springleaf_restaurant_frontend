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

    findMergeTablesByMergeTableId(mergeTableId: string): Observable<MergeTable[]> {
        if (!this.cache) {
            return of([]);
        }

        // Find all MergeTable instances with the specified mergeTableId
        const matchingMergeTables = this.cache.filter(mergeTable => mergeTable.mergeTableId === mergeTableId);

        return of(matchingMergeTables);
    }

    updateStatusTablesByMergeTableId(mergeTableId: string, status: string): void {
        if (!this.cache) {
            return;
        }
    
        const matchingMergeTables = this.cache.filter(mergeTable => mergeTable.mergeTableId === mergeTableId);
    
        // Update the status for each matching MergeTable
        matchingMergeTables.forEach(mergeTable => {
            mergeTable.status = status;
        });
    
        // Update the backend for each matching MergeTable
        matchingMergeTables.forEach(mergeTable => {
            const updatedObject = { ...mergeTable, status: status };
            this.update(updatedObject).subscribe(
                updatedMergeTable => {
                    // Handle the updated MergeTable if needed
                    console.log('Status updated successfully:', updatedMergeTable);
                },
                error => {
                    // Handle error if the update fails
                    console.error('Error updating status:', error);
                }
            );
        });
    }

}
