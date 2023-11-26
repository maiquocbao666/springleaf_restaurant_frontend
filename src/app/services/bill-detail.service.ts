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
})export class BillDetailService extends BaseService<BillDetail>  {

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apisUrl = 'billDetails';
  cacheKey = 'billDetails';
  apiUrl = 'billDetail';


  override gets(): Observable<BillDetail[]> {
    return super.gets();
  }

  override getById(id: number): Observable<BillDetail | null> {
    return super.getById(id);
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

  override getItemId(item: BillDetail): number {
    throw new Error('Method not implemented.');
  }
  override getItemName(item: BillDetail): string {
    throw new Error('Method not implemented.');
  }
  override getObjectName(): string {
    throw new Error('Method not implemented.');
  }
}