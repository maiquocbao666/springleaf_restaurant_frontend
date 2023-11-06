
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ComboDetail } from '../interfaces/combo-detail';


@Injectable({
    providedIn: 'root'
})
export class ComboDetailService {

    private comboDetailsUrl = 'comboDetails';
    comboDetailsCache!: ComboDetail[];

    constructor(

        private apiService: ApiService

    ) {

    }

    getComboDetails(): Observable<ComboDetail[]> {

        if (this.comboDetailsCache) {

            return of(this.comboDetailsCache);

        }

        const comboDetailsObservable = this.apiService.request<ComboDetail[]>('get', this.comboDetailsUrl);


        comboDetailsObservable.subscribe(data => {

            this.comboDetailsCache = data;

        });

        return comboDetailsObservable;
        
    }

}