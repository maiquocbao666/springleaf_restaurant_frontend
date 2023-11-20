
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Combo } from '../interfaces/combo';


@Injectable({
    providedIn: 'root'
})
export class ComboService {

    private combosUrl = 'combos';
    private comboUrl = 'combo';
    combosCache!: Combo[];

    constructor(private apiService: ApiService) { }


    getCombos(): Observable<Combo[]> {

        if (this.combosCache) {
            return of(this.combosCache);
        }

        const combosObservable = this.apiService.request<Combo[]>('get', this.combosUrl);


        combosObservable.subscribe(data => {
            this.combosCache = data;
        });

        return combosObservable;

    }

    getComboById(id: number): Observable<Combo> {

        if (!this.combosCache) {

            this.getCombos();

        }


        const comboFromCache = this.combosCache.find(combo => combo.comboId === id);

        if (comboFromCache) {

            return of(comboFromCache);

        } else {

            const url = `${this.comboUrl}/${id}`;
            return this.apiService.request<Combo>('get', url);
        }

    }

    private isComboNameInCache(name: string): boolean {
        const isTrue = !!this.combosCache?.find(combo => combo.comboName.toLowerCase() === name.toLowerCase());
        if(isTrue){
            console.log('Combo này đã tồn tại trong cache.');
            return isTrue;
        }else {
            return isTrue;
        }
    }

    addCombo(newCombo: Combo): Observable<Combo> {

        if (this.isComboNameInCache(newCombo.comboName)) {
            // Nếu đã có combo có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        // Nếu không có combo có tên tương tự trong cache, tiếp tục thêm combo mới
        return this.apiService.request<Combo>('post', this.comboUrl, newCombo).pipe(
            tap((addedCombo: Combo) => {
                this.combosCache.push(addedCombo);
                localStorage.setItem(this.combosUrl, JSON.stringify(this.combosCache));
            })
        );
    }

    updateCombo(updatedCombo: Combo): Observable<any> {

        if (this.isComboNameInCache(updatedCombo.comboName)) {
            // Nếu đã có combo có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        const url = `${this.comboUrl}/${updatedCombo.comboId}`;

        return this.apiService.request('put', url, updatedCombo).pipe(

            tap(() => {

                const index = this.combosCache!.findIndex(combo => combo.comboId === updatedCombo.comboId);

                if (index !== -1) {

                    this.combosCache![index] = updatedCombo;
                    localStorage.setItem(this.combosUrl, JSON.stringify(this.combosCache));

                }

            })

        );

    }

    updateComboCache(updatedCombo: Combo): void {

        if (this.combosCache) {

            const index = this.combosCache.findIndex(cat => cat.comboId === updatedCombo.comboId);

            if (index !== -1) {

                this.combosCache[index] = updatedCombo;

            }

        }
    }

    deleteCombo(id: number): Observable<any> {

        const url = `${this.comboUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.combosCache.findIndex(combo => combo.comboId === id);

                if (index !== -1) {

                    this.combosCache.splice(index, 1);
                    localStorage.setItem(this.combosUrl, JSON.stringify(this.combosCache));

                }

            })
        );

    }



}