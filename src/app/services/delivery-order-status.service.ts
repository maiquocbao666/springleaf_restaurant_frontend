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

  //------------------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //------------------------------------------------------------------------------------------------------------------

  apisUrl = 'deliveryOrderStatuses';
  cacheKey = 'deliveryOrderStatuses';
  apiUrl = 'deliveryOrderStatus';

  //------------------------------------------------------------------------------------------------------------------

  getItemId(item: DeliveryOrderStatus): number {
    return item.deliveryOrderStatusId!;
  }
  
  getItemName(item: DeliveryOrderStatus): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return 'DeliveryOrderStatus';
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //------------------------------------------------------------------------------------------------------------------

  override add(newDeliveryOrderStatus: DeliveryOrderStatus): Observable<DeliveryOrderStatus> {
    return super.add(newDeliveryOrderStatus);
  }

  override update(updated: DeliveryOrderStatus): Observable<any> {
    return super.update(updated);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  //------------------------------------------------------------------------------------------------------------------



  //------------------------------------------------------------------------------------------------------------------

}