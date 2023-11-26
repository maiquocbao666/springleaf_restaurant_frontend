import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ComboDetail } from '../interfaces/combo-detail';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ComboDetailService extends BaseService<ComboDetail> {

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apiUrl = 'comboDetail';
  apisUrl = 'comboDetails';
  cacheKey = 'comboDetails';

  getItemId(item: ComboDetail): number {
    return item.comboDetailId!;
  }

  override getItemName(item: ComboDetail): string {
    throw new Error('Method not implemented.');
  }

  override getObjectName(): string {
    return "ComboDetail";
  }

  override gets(): Observable<ComboDetail[]> {
    return super.gets();
  }

  override add(newComboDetail: ComboDetail): Observable<ComboDetail> {
    return super.add(newComboDetail);
  }

  override update(updatedComboDetail: ComboDetail): Observable<ComboDetail> {
    return super.update(updatedComboDetail);
  }

  override delete(id: number): Observable<ComboDetail> {
    return super.delete(id);
  }

}