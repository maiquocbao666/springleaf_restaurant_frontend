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

  //----------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //----------------------------------------------------------------------------

  apisUrl = 'deliveryOrderDetails';
  cacheKey = 'deliveryOrderDetails';
  apiUrl = 'deliveryOrderDetail';

  //----------------------------------------------------------------------------

  getItemId(item: DeliveryOrderDetail): number {
    return item.deliveryOrderDetailId!;
  }

  getItemName(item: DeliveryOrderDetail): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return 'DeliveryOrderDetail';
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //----------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newDeliveryOrderDetail: DeliveryOrderDetail): Observable<DeliveryOrderDetail> {
    return super.add(newDeliveryOrderDetail);
  }

  override update(updated: DeliveryOrderDetail): Observable<any> {
    return super.update(updated);
  }
  
  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  override sortEntities(entities: DeliveryOrderDetail[], field: keyof DeliveryOrderDetail, ascending: boolean): Observable<DeliveryOrderDetail[]> {
    return super.sortEntities(entities, field, ascending);
  }

  //----------------------------------------------------------------------------

}