import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrderStatus } from './../interfaces/delivery-order-status';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderStatusService extends BaseService<DeliveryOrderStatus> {


  apisUrl = 'deliveryOrderStatuses';
  cacheKey = 'deliveryOrderStatuses';
  apiUrl = 'deliveryOrderStatus';


  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }


  getObjectName(): string {
    return 'DeliveryOrderStatus';
  }

  override gets(): Observable<DeliveryOrderStatus[]> {
    return super.gets();
  }

  override getById(id: number): Observable<DeliveryOrderStatus | null> {
    return super.getById(id);
  }

  override add(newDeliveryOrderStatus: DeliveryOrderStatus): Observable<DeliveryOrderStatus> {
    return super.add(newDeliveryOrderStatus);
  }

  override update(updated: DeliveryOrderStatus): Observable<any> {
    return super.update(updated);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override getItemId(item: DeliveryOrderStatus): number {
    throw new Error('Method not implemented.');
  }
  override getItemName(item: DeliveryOrderStatus): string {
    throw new Error('Method not implemented.');
  }

}