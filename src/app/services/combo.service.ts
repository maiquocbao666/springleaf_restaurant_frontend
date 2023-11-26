import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Combo } from '../interfaces/combo';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ComboService extends BaseService<Combo> {

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apisUrl = 'combos';
  cacheKey = 'combos';
  apiUrl = 'combo';

  override getItemId(item: Combo): number {
    return item.comboId!;
  }
  override getItemName(item: Combo): string {
    return item.comboName;
  }
  override getObjectName(): string {
    return "Combo";
  }

  override gets(): Observable<Combo[]> {
    return super.gets();
  }

  override getById(id: number): Observable<Combo | null> {
    return super.getById(id);
  }

  override add(newCombo: Combo): Observable<Combo> {
    return super.add(newCombo);
  }

  override update(updatedCombo: Combo): Observable<Combo> {
    return super.update(updatedCombo);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override searchByName(term: string): Observable<Combo[]> {
    return super.searchByName(term);
  }

}