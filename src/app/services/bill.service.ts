import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Bill } from '../interfaces/bill';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BillService extends BaseService<Bill> {

  //------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //-------------------------------------------------------------

  apiUrl = 'bill';
  apisUrl = 'bills';
  cacheKey = 'bills';

  //------------------------------------------------------

  getItemId(item: Bill): number {
    return item.billId!;
  }

  getItemName(item: Bill): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return "Bill";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //---------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newBill: Bill): Observable<Bill> {
    return super.add(newBill);
  }

  override update(updatedBill: Bill): Observable<Bill> {
    return super.update(updatedBill);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  //---------------------------------------------------------

}