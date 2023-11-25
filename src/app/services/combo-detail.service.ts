import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ComboDetail } from '../interfaces/combo-detail';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComboDetailService {

  private comboDetailsUrl = 'comboDetails';
  private comboDetailUrl = 'comboDetail';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private comboDetailsCacheSubject = new BehaviorSubject<ComboDetail[]>([]);
  comboDetailsCache$ = this.comboDetailsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get comboDetailsCache(): ComboDetail[] {
    return this.comboDetailsCacheSubject.value;
  }

  set comboDetailsCache(value: ComboDetail[]) {
    this.comboDetailsCacheSubject.next(value);
  }

  gets(): Observable<ComboDetail[]> {
    if (this.comboDetailsCache) {
      return of(this.comboDetailsCache);
    }

    const comboDetailsObservable = this.apiService.request<ComboDetail[]>('get', this.comboDetailsUrl);

    comboDetailsObservable.subscribe(data => {
      this.comboDetailsCache = data;
    });

    return comboDetailsObservable;
  }

  add(newComboDetail: ComboDetail): Observable<ComboDetail> {
    return this.apiService.request<ComboDetail>('post', this.comboDetailUrl, newComboDetail).pipe(
      tap((addedComboDetail: ComboDetail) => {
        this.comboDetailsCache = [...this.comboDetailsCache, addedComboDetail];
        localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));
      })
    );
  }

  update(updatedComboDetail: ComboDetail): Observable<any> {
    const url = `${this.comboDetailUrl}`;

    return this.apiService.request('put', url, updatedComboDetail).pipe(
      tap(() => {
        const index = this.comboDetailsCache!.findIndex(detail => detail.comboDetailId === updatedComboDetail.comboDetailId);

        if (index !== -1) {
          this.comboDetailsCache![index] = updatedComboDetail;
          localStorage.setItem(this.comboDetailsUrl, JSON.stringify(this.comboDetailsCache));
        }
      })
    );
  }
  
  delete(id: number): Observable<any> {
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