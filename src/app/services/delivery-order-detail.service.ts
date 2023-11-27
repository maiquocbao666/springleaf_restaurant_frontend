import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderDetail } from '../interfaces/delivery-order-detail';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderDetailService extends BaseService<DeliveryOrderDetail> {

  apisUrl = 'deliveryOrderDetails';
  cacheKey = 'deliveryOrderDetails';
  apiUrl = 'deliveryOrderDetail';

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  getObjectName(): string {
    return 'DeliveryOrderDetail';
  }

  override gets(): Observable<DeliveryOrderDetail[]> {
    return super.gets();
  }

  override add(newDeliveryOrderDetail: DeliveryOrderDetail): Observable<DeliveryOrderDetail> {
    return super.add(newDeliveryOrderDetail);
  }

  override update(updated: DeliveryOrderDetail): Observable<any> {
    return super.update(updated);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override getItemId(item: DeliveryOrderDetail): number {
    return item.deliveryOrderDetailId!;
  }
  override getItemName(item: DeliveryOrderDetail): string {
    throw new Error('Method not implemented.');
  }

}