
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Combo } from '../interfaces/combo';


@Injectable({
    providedIn: 'root'
})
export class ComboService {

    private combosUrl = 'combos'; // URL to web api, không cần thêm base URL
    combosCache!: Combo[]; // Cache for categories
    private comboUrl = 'combo';
    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getCombos(): Observable<Combo[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.combosCache) {
            return of(this.combosCache);
        }

        const combosObservable = this.apiService.request<Combo[]>('get', this.combosUrl);

        // Cache the categories observable
        combosObservable.subscribe(data => {
            this.combosCache = data; // Store the fetched data in the cache
        });

        return combosObservable;
    }
    // Thêm sản phẩm mới
    addCombo(newCombo: Combo): Observable<Combo> {
        return this.apiService.request<Combo>('post', this.comboUrl, newCombo);
    }

    // Cập nhật sản phẩm
    updateCombo(updatedCombo: Combo): Observable<any> {
        const url = `${this.comboUrl}/${updatedCombo.comboId}`;
        return this.apiService.request('put', url, updatedCombo).pipe(
            tap(() => {
                // Cập nhật danh sách cache sau khi cập nhật danh mục
                const index = this.combosCache!.findIndex(cat => cat.comboId === updatedCombo.comboId);
                if (index !== -1) {
                    this.combosCache![index] = updatedCombo;
                    localStorage.setItem('combos', JSON.stringify(this.combosCache));
                }
            })
        );
    }
    updateComboCache(updatedCombo: Combo): void {
        // Check if categoriesCache is null
        if (this.combosCache) {
            const index = this.combosCache.findIndex(cat => cat.comboId === updatedCombo.comboId);
            if (index !== -1) {
                this.combosCache[index] = updatedCombo;
            }
        }
    }
    // Xoá sản phẩm
    deleteCombo(id: number): Observable<any> {
        const url = `${this.comboUrl}/${id}`;
        return this.apiService.request('delete', url);
    }


}