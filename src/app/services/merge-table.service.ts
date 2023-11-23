import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { MergeTable } from './../interfaces/merge-table';

@Injectable({
    providedIn: 'root'
})
export class MergeTableService {

    private mergeTablesUrl = 'mergeTables';
    private mergeTableUrl = 'mergeTable';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private mergeTablesCacheSubject = new BehaviorSubject<MergeTable[]>([]);
    mergeTablesCache$ = this.mergeTablesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get mergeTablesCache(): MergeTable[] {
        return this.mergeTablesCacheSubject.value;
    }

    set mergeTablesCache(value: MergeTable[]) {
        this.mergeTablesCacheSubject.next(value);
    }

    getMergeTables(): Observable<MergeTable[]> {

        if (this.mergeTablesCache.length > 0) {
            return of(this.mergeTablesCache);
        }

        const mergeTablesObservable = this.apiService.request<MergeTable[]>('get', this.mergeTablesUrl);

        mergeTablesObservable.subscribe(data => {
            this.mergeTablesCache = data;
        });

        return mergeTablesObservable;

    }

    addMergeTable(newMergeTable: MergeTable): Observable<MergeTable> {

        return this.apiService.request<MergeTable>('post', this.mergeTableUrl, newMergeTable).pipe(

            tap((addedMergeTable: MergeTable) => {

                this.mergeTablesCache = [...this.mergeTablesCache, addedMergeTable];
                localStorage.setItem(this.mergeTablesUrl, JSON.stringify(this.mergeTablesCache));

            })

        );

    }

    updateMergeTable(updatedMergeTable: MergeTable): Observable<any> {

        const url = `${this.mergeTableUrl}/${updatedMergeTable.mergeTableId}`;

        return this.apiService.request('put', url, updatedMergeTable).pipe(

            tap(() => {

                this.updateMergeTableCache(updatedMergeTable);

                const index = this.mergeTablesCache!.findIndex(table => table.mergeTableId === updatedMergeTable.mergeTableId);

                if (index !== -1) {

                    this.mergeTablesCache![index] = updatedMergeTable;
                    localStorage.setItem(this.mergeTablesUrl, JSON.stringify(this.mergeTablesCache));

                }

            })

        );

    }

    updateMergeTableCache(updatedMergeTable: MergeTable): void {

        if (this.mergeTablesCache) {

            const index = this.mergeTablesCache.findIndex(table => table.mergeTableId === updatedMergeTable.mergeTableId);

            if (index !== -1) {

                this.mergeTablesCache[index] = updatedMergeTable;

            }

        }

    }

    deleteMergeTable(id: string): Observable<any> {

        const url = `${this.mergeTableUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.mergeTablesCache.findIndex(table => table.mergeTableId === id);

                if (index !== -1) {

                    this.mergeTablesCache.splice(index, 1);
                    localStorage.setItem(this.mergeTablesUrl, JSON.stringify(this.mergeTablesCache));

                }

            })
        );

    }
}