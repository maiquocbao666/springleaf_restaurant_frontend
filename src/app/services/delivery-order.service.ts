import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DeliveryOrder } from '../interfaces/delivery-order';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryOrderService extends BaseService<DeliveryOrder>  {
  override getItemId(item: DeliveryOrder): number {
    throw new Error('Method not implemented.');
  }
  override getItemName(item: DeliveryOrder): string {
    throw new Error('Method not implemented.');
  }

  apisUrl = 'deliveryOrders';
  cacheKey = 'deliveryOrders';
  apiUrl = 'deliveryOrder';

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  getObjectName(): string {
    return 'DeliveryOrder';
  }

  override gets(): Observable<DeliveryOrder[]> {
    return super.gets();
  }

  override getById(id: number): Observable<DeliveryOrder | null> {
    return super.getById(id);
  }

  override add(newDeliveryOrder: DeliveryOrder): Observable<DeliveryOrder> {
    return super.add(newDeliveryOrder);
  }

  override update(updated: DeliveryOrder): Observable<any> {
    return super.update(updated);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }


}