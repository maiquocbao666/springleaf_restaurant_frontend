
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
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

    addComboDetail(newComboDetail: ComboDetail): Observable<ComboDetail> {

        return this.apiService.request<ComboDetail>('post', this.comboDetailsUrl, newComboDetail).pipe(

            tap((addedBill: ComboDetail) => {

                this.comboDetailsCache.push(addedBill);
                localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));

            })

        );

    }

    updateComboDetail(updatedComboDetail: ComboDetail): Observable<any> {

        const url = `${this.comboDetailsUrl}/${updatedComboDetail.comboDetailId}`;

        return this.apiService.request('put', url, updatedComboDetail).pipe(

            tap(() => {

                const index = this.comboDetailsCache!.findIndex(comboDetail => comboDetail.comboDetailId === updatedComboDetail.comboDetailId);

                if (index !== -1) {

                    this.comboDetailsCache![index] = updatedComboDetail;
                    localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));

                }

            })

        );

    }

}