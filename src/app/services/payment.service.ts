import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Payment } from '../interfaces/payment';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends BaseService<Payment> {

  //-----------------------------------------------------------------------------------------------------------

  apisUrl = 'payments';
  cacheKey = 'payments';
  apiUrl = 'payment';

  //-----------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //-----------------------------------------------------------------------------------------------------------

  getItemId(item: Payment): number {
    return item.paymentId!;
  }

  getItemName(item: Payment): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return "Payment";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-----------------------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: Payment): Observable<Payment> {
    return super.add(newObject);
  }

  override update(updatedObject: Payment): Observable<Payment> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  override searchByName(term: string): Observable<Payment[]> {
    return super.searchByName(term);
  }

  //-----------------------------------------------------------------------------------------------------------

}
