import { MergeTable } from './../interfaces/merge-table';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class MergeTableService {

    private mergeTablesUrl = 'mergeTables'; 
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



}