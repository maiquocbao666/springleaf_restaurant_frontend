import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { InventoryBranch } from '../interfaces/inventory-branch';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryBranchService extends BaseService<InventoryBranch> {

  //-------------------------------------------------------------------------------------------------------

  apisUrl = 'inventoryBranches';
  cacheKey = 'inventoryBranches';
  apiUrl = 'inventoryBranch';

  //-------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //-------------------------------------------------------------------------------------------------------

  getItemName(item: InventoryBranch): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return "InventoryBranch";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-------------------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: InventoryBranch): Observable<InventoryBranch> {
    return super.add(newObject);
  }

  override update(updatedObject: InventoryBranch): Observable<InventoryBranch> {
    return super.update(updatedObject);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override getItemId(item: InventoryBranch): number {
    return item.inventoryBranchId!;
  }

  //-------------------------------------------------------------------------------------------------------

}
