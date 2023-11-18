
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ComboDetail } from '../interfaces/combo-detail';


@Injectable({
    providedIn: 'root'
})
export class ComboDetailService {

    private comboDetailsUrl = 'comboDetails';
    private comboDetailUrl = 'comboDetail';
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

        return this.apiService.request<ComboDetail>('post', this.comboDetailUrl, newComboDetail).pipe(

            tap((addedBill: ComboDetail) => {

                this.comboDetailsCache.push(addedBill);
                localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));

            })

        );

    }

    updateComboDetail(updatedComboDetail: ComboDetail): Observable<any> {

        const url = `${this.comboDetailUrl}`;

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


    updateComboDetailCache(updatedComboDetail: ComboDetail): void {
        if (this.comboDetailsCache) {
            const index = this.comboDetailsCache.findIndex(detail => detail.comboDetailId === updatedComboDetail.comboDetailId);

            if (index !== -1) {
                this.comboDetailsCache[index] = updatedComboDetail;
            }
        }
    }


    deleteComboDetail(id: number): Observable<any> {

        const url = `${this.comboDetailUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.comboDetailsCache.findIndex(comboDetail => comboDetail.comboDetailId === id);

                if (index !== -1) {

                    this.comboDetailsCache.splice(index, 1);
                    localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));

                }

            })
        );

    }


}