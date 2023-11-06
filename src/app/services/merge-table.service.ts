import { MergeTable } from './../interfaces/merge-table';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class MergeTableService {

    private mergeTablesUrl = 'mergeTables'; 
    private mergeTableUrl = 'mergeTable'; 
    mergeTablesCache!: MergeTable[];

    constructor(private apiService: ApiService) { }

   
    getMergeTablesUrls(): Observable<MergeTable[]> {
       
        if (this.mergeTablesCache) {

            console.log("Có Inventorys cache");
            return of(this.mergeTablesCache);

        }

        const mergeTablesObservable = this.apiService.request<MergeTable[]>('get', this.mergeTablesUrl);

        
        mergeTablesObservable.subscribe(data => {

            this.mergeTablesCache = data; 

        });

        return mergeTablesObservable;
        
    }

    addMergeTable(newMergeTable: MergeTable): Observable<MergeTable> {

        return this.apiService.request<MergeTable>('post', this.mergeTablesUrl, newMergeTable).pipe(

            tap((addedMergeTable: MergeTable) => {

                this.mergeTablesCache.push(addedMergeTable);
                localStorage.setItem(this.mergeTablesUrl, JSON.stringify(this.mergeTablesCache));

            })

        );

    }

    updateMergeTable(updatedMergeTable: MergeTable): Observable<any> {

        const url = `${this.mergeTablesUrl}/${updatedMergeTable.mergeTableId}`;

        return this.apiService.request('put', url, updatedMergeTable).pipe(

            tap(() => {

                const index = this.mergeTablesCache!.findIndex(mergeTable => mergeTable.mergeTableId === updatedMergeTable.mergeTableId);

                if (index !== -1) {

                    this.mergeTablesCache![index] = updatedMergeTable;
                    localStorage.setItem(this.mergeTablesUrl, JSON.stringify(this.mergeTablesCache));

                }

            })

        );

    }

}