import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderStatus } from './../interfaces/delivery-order-status';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderStatusService {

  private deliveryOrderStatusesUrl = 'deliveryOrderStatuses';
  private deliveryOrderStatusUrl = 'deliveryOrderStatus';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private deliveryOrderStatusesCacheSubject = new BehaviorSubject<DeliveryOrderStatus[]>([]);
  deliveryOrderStatusesCache$ = this.deliveryOrderStatusesCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get deliveryOrderStatusesCache(): DeliveryOrderStatus[] {
    return this.deliveryOrderStatusesCacheSubject.value;
  }

  set deliveryOrderStatusesCache(value: DeliveryOrderStatus[]) {
    this.deliveryOrderStatusesCacheSubject.next(value);
  }

  getDeliveryOrderStatuss(): Observable<DeliveryOrderStatus[]> {
    if (this.deliveryOrderStatusesCache) {
      return of(this.deliveryOrderStatusesCache);
    }

    const deliveryOrderStatusesObservable = this.apiService.request<DeliveryOrderStatus[]>('get', this.deliveryOrderStatusesUrl);

    deliveryOrderStatusesObservable.subscribe(data => {
      this.deliveryOrderStatusesCache = data;
    });

    return deliveryOrderStatusesObservable;
  }

  addDeliveryOrderStatus(newDeliveryOrderStatus: DeliveryOrderStatus): Observable<DeliveryOrderStatus> {
    return this.apiService.request<DeliveryOrderStatus>('post', this.deliveryOrderStatusUrl, newDeliveryOrderStatus).pipe(
      tap((addedDeliveryOrderStatus: DeliveryOrderStatus) => {
        this.deliveryOrderStatusesCache = [...this.deliveryOrderStatusesCache, addedDeliveryOrderStatus];
        localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));
      })
    );
  }

  updateDeliveryOrderStatus(updatedDeliveryOrderStatus: DeliveryOrderStatus): Observable<any> {
    const url = `${this.deliveryOrderStatusUrl}/${updatedDeliveryOrderStatus.deliveryOrderStatusId}`;

    return this.apiService.request('put', url, updatedDeliveryOrderStatus).pipe(
      tap(() => {
        const index = this.deliveryOrderStatusesCache!.findIndex(
          deliveryOrderStatus => deliveryOrderStatus.deliveryOrderStatusId === updatedDeliveryOrderStatus.deliveryOrderStatusId
        );

        if (index !== -1) {
          this.deliveryOrderStatusesCache![index] = updatedDeliveryOrderStatus;
          localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));
        }
      })
    );
  }

  deleteDeliveryOrderStatus(id: number): Observable<any> {
    if (!id) {
      return of(null);
    }

    const url = `${this.deliveryOrderStatusUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.deliveryOrderStatusesCache.findIndex(status => status.deliveryOrderStatusId === id);

        if (index !== -1) {
          this.deliveryOrderStatusesCache.splice(index, 1);
          localStorage.setItem(this.deliveryOrderStatusesUrl, JSON.stringify(this.deliveryOrderStatusesCache));
        }
      })
    );
  }
}