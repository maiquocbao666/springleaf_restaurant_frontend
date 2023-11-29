import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { BillDetail } from '../interfaces/bill-detail';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
}) export class BillDetailService extends BaseService<BillDetail>  {

  //----------------------------------------------------------------

  apisUrl = 'billDetails';
  cacheKey = 'billDetails';
  apiUrl = 'billDetail';

  //-----------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //----------------------------------------------------------------

  getItemId(item: BillDetail): number {
    return item.billDetailId!;
  }

  getItemName(item: BillDetail): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    throw new Error('Method not implemented.');
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newBillDetail: BillDetail): Observable<BillDetail> {
    return super.add(newBillDetail);
  }

  override update(updated: BillDetail): Observable<any> {
    return super.update(updated);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  //------------------------------------------------------------------------

}