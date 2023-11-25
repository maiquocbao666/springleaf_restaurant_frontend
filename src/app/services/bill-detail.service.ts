import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BillDetail } from '../interfaces/bill-detail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillDetailService {

  private billDetailsUrl = 'billDetails';
  private billDetailUrl = 'billDetail';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private billDetailsCacheSubject = new BehaviorSubject<BillDetail[]>([]);
  billDetailsCache$ = this.billDetailsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get billDetailsCache(): BillDetail[] {
    return this.billDetailsCacheSubject.value;
  }

  set billDetailsCache(value: BillDetail[]) {
    this.billDetailsCacheSubject.next(value);
  }

  gets(): Observable<BillDetail[]> {
    if (this.billDetailsCache) {
      return of(this.billDetailsCache);
    }

    const billDetailsObservable = this.apiService.request<BillDetail[]>('get', this.billDetailsUrl);

    billDetailsObservable.subscribe(data => {
      this.billDetailsCache = data;
    });

    return billDetailsObservable;
  }

  add(newBillDetail: BillDetail): Observable<BillDetail> {
    return this.apiService.request<BillDetail>('post', this.billDetailUrl, newBillDetail).pipe(
      tap((addedBillDetail: BillDetail) => {
        this.billDetailsCache = [...this.billDetailsCache, addedBillDetail];
        localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));
      })
    );
  }

  update(updatedBillDetail: BillDetail): Observable<any> {
    const url = `${this.billDetailUrl}/${updatedBillDetail.billDetailId}`;

    return this.apiService.request('put', url, updatedBillDetail).pipe(
      tap(() => {
        const index = this.billDetailsCache!.findIndex(
          billDetail => billDetail.billDetailId === updatedBillDetail.billDetailId
        );

        if (index !== -1) {
          this.billDetailsCache![index] = updatedBillDetail;
          localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));
        }
      })
    );
  }

  delete(id: number): Observable<any> {
    if (!id) {
      return of(null);
    }

    const url = `${this.billDetailUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.billDetailsCache.findIndex(billDetail => billDetail.billDetailId === id);

        if (index !== -1) {
          this.billDetailsCache.splice(index, 1);
          localStorage.setItem(this.billDetailsUrl, JSON.stringify(this.billDetailsCache));
        }
      })
    );
  }

}