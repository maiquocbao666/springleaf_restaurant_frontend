import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderDetailService {

  private deliveryOrderDetailsUrl = 'deliveryOrderDetails';
  private deliveryOrderDetailUrl = 'deliveryOrderDetail';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private deliveryOrderDetailsCacheSubject = new BehaviorSubject<DeliveryOrderDetail[]>([]);
  deliveryOrderDetailsCache$ = this.deliveryOrderDetailsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get deliveryOrderDetailsCache(): DeliveryOrderDetail[] {
    return this.deliveryOrderDetailsCacheSubject.value;
  }

  set deliveryOrderDetailsCache(value: DeliveryOrderDetail[]) {
    this.deliveryOrderDetailsCacheSubject.next(value);
  }

  gets(): Observable<DeliveryOrderDetail[]> {
    if (this.deliveryOrderDetailsCache) {
      return of(this.deliveryOrderDetailsCache);
    }

    const deliveryOrderDetailsObservable = this.apiService.request<DeliveryOrderDetail[]>('get', this.deliveryOrderDetailsUrl);

    deliveryOrderDetailsObservable.subscribe(data => {
      this.deliveryOrderDetailsCache = data;
    });

    return deliveryOrderDetailsObservable;
  }

  add(newDeliveryOrderDetail: DeliveryOrderDetail): Observable<DeliveryOrderDetail> {
    return this.apiService.request<DeliveryOrderDetail>('post', this.deliveryOrderDetailUrl, newDeliveryOrderDetail).pipe(
      tap((addedDeliveryOrderDetail: DeliveryOrderDetail) => {
        this.deliveryOrderDetailsCache = [...this.deliveryOrderDetailsCache, addedDeliveryOrderDetail];
        localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));
      })
    );
  }

  update(updatedDeliveryOrderDetail: DeliveryOrderDetail): Observable<any> {
    const url = `${this.deliveryOrderDetailUrl}/${updatedDeliveryOrderDetail.deliveryOrderDetailId}`;

    return this.apiService.request('put', url, updatedDeliveryOrderDetail).pipe(
      tap(() => {
        const index = this.deliveryOrderDetailsCache!.findIndex(
          deliveryOrderDetail => deliveryOrderDetail.deliveryOrderDetailId === updatedDeliveryOrderDetail.deliveryOrderDetailId
        );

        if (index !== -1) {
          this.deliveryOrderDetailsCache![index] = updatedDeliveryOrderDetail;
          localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));
        }
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.deliveryOrderDetailUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.deliveryOrderDetailsCache.findIndex(detail => detail.deliveryOrderDetailId === id);

        if (index !== -1) {
          this.deliveryOrderDetailsCache.splice(index, 1);
          localStorage.setItem(this.deliveryOrderDetailsUrl, JSON.stringify(this.deliveryOrderDetailsCache));
        }
      })
    );
  }

}