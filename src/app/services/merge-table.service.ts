import { MergeTable } from './../interfaces/merge-table';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class MergeTableService {

    private mergeTablesUrl = 'mergeTables'; // URL to web api, không cần thêm base URL
    mergeTablesCache!: MergeTable[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getMergeTablesUrls(): Observable<MergeTable[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.mergeTablesCache) {
            console.log("Có Inventorys cache");
            return of(this.mergeTablesCache);
        }

        const mergeTablesObservable = this.apiService.request<MergeTable[]>('get', this.mergeTablesUrl);

        // Cache the categories observable
        mergeTablesObservable.subscribe(data => {
            this.mergeTablesCache = data; // Store the fetched data in the cache
        });

        return mergeTablesObservable;
    }



}