
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ComboDetail } from '../interfaces/combo-detail';


@Injectable({
    providedIn: 'root'
})
export class ComboDetailService {

    private comboDetailsUrl = 'comboDetails'; // URL to web api, không cần thêm base URL
    comboDetailsCache!: ComboDetail[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getComboDetails(): Observable<ComboDetail[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.comboDetailsCache) {
            return of(this.comboDetailsCache);
        }

        const comboDetailsObservable = this.apiService.request<ComboDetail[]>('get', this.comboDetailsUrl);

        // Cache the categories observable
        comboDetailsObservable.subscribe(data => {
            this.comboDetailsCache = data; // Store the fetched data in the cache
        });

        return comboDetailsObservable;
    }



}