import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Combo } from '../interfaces/combo';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  private combosUrl = 'combos';
  private comboUrl = 'combo';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private combosCacheSubject = new BehaviorSubject<Combo[]>([]);
  combosCache$ = this.combosCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get combosCache(): Combo[] {
    return this.combosCacheSubject.value;
  }

  set combosCache(value: Combo[]) {
    this.combosCacheSubject.next(value);
  }

  getCombos(): Observable<Combo[]> {
    if (this.combosCache.length > 0) {
      return of(this.combosCache);
    }

    const combosObservable = this.apiService.request<Combo[]>('get', this.combosUrl);

    combosObservable.subscribe(data => {
      this.combosCache = data;
    });

    return combosObservable;
  }

  getComboById(id: number): Observable<Combo> {
    if (!this.combosCache.length) {
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
    if (isTrue) {
      console.log('Combo này đã tồn tại trong cache.');
      return isTrue;
    } else {
      return isTrue;
    }
  }

  addCombo(newCombo: Combo): Observable<Combo> {
    if (this.combosCache.length > 0) {
      if (this.isComboNameInCache(newCombo.comboName)) {
        return of();
      }
    }

    return this.apiService.request<Combo>('post', this.comboUrl, newCombo).pipe(
      tap((addedCombo: Combo) => {
        this.combosCache = [...this.combosCache, addedCombo];
        localStorage.setItem(this.combosUrl, JSON.stringify(this.combosCache));
      })
    );
  }

  updateCombo(updatedCombo: Combo): Observable<any> {
    if (this.combosCache.length > 0) {
      if (this.isComboNameInCache(updatedCombo.comboName)) {
        return of();
      }
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