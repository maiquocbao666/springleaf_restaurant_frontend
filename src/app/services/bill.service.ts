import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Bill } from '../interfaces/bill';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private billsUrl = 'bills';
  private billUrl = 'bill';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private billsCacheSubject = new BehaviorSubject<Bill[]>([]);
  billsCache$ = this.billsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get billsCache(): Bill[] {
    return this.billsCacheSubject.value;
  }

  set billsCache(value: Bill[]) {
    this.billsCacheSubject.next(value);
  }

  getBills(): Observable<Bill[]> {
    if (this.billsCache) {
      return of(this.billsCache);
    }

    const billsObservable = this.apiService.request<Bill[]>('get', this.billsUrl);

    billsObservable.subscribe(data => {
      this.billsCache = data;
    });

    return billsObservable;
  }

  addBill(newBill: Bill): Observable<Bill> {
    return this.apiService.request<Bill>('post', this.billUrl, newBill).pipe(
      tap((addedBill: Bill) => {
        this.billsCache = [...this.billsCache, addedBill];
        localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));
      })
    );
  }

  updateBill(updatedBill: Bill): Observable<any> {
    const url = `${this.billUrl}/${updatedBill.billId}`;

    return this.apiService.request('put', url, updatedBill).pipe(
      tap(() => {
        const index = this.billsCache!.findIndex(bill => bill.billId === updatedBill.billId);

        if (index !== -1) {
          this.billsCache![index] = updatedBill;
          localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));
        }
      })
    );
  }

  deleteBill(id: number): Observable<any> {
    if (!id) {
      return of(null);
    }

    const url = `${this.billUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.billsCache.findIndex(bill => bill.billId === id);

        if (index !== -1) {
          this.billsCache.splice(index, 1);
          localStorage.setItem(this.billsUrl, JSON.stringify(this.billsCache));
        }
      })
    );
  }

}