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

  apisUrl = 'inventoryBranches';
  cacheKey = 'inventoryBranches';
  apiUrl = 'inventoryBranch';



  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }


  override gets(): Observable<InventoryBranch[]> {
    return super.gets();
  }

  override getById(id: number): Observable<InventoryBranch | null> {
    return super.getById(id);
  }

  override add(newObject: InventoryBranch): Observable<InventoryBranch> {
    return super.add(newObject);
  }

  override update(updatedObject: InventoryBranch): Observable<InventoryBranch> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<InventoryBranch> {
    return super.delete(id);
  }

  override searchByName(term: string): Observable<InventoryBranch[]> {
    return super.searchByName(term);
  }

  override getItemId(item: InventoryBranch): number {
    return item.inventoryBranchId!;
  }

  override getItemName(item: InventoryBranch): string {
    throw new Error('Method not implemented.');
  }

  override getObjectName(): string {
    return "InventoryBranch";
  }
}
