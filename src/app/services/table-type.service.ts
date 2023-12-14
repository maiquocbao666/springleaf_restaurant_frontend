import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class TableTypeService extends BaseService<TableType> {

  //----------------------------------------------------------------------------------------------------------------

  apisUrl = 'tableTypes';
  cacheKey = 'tableTypes';
  apiUrl = 'tableType';

  //----------------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //----------------------------------------------------------------------------------------------------------------

  getItemId(item: TableType): number {
    return item.tableTypeId!;
  }

  getItemName(item: TableType): string {
    return item.tableTypeName;
  }

  getObjectName(): string {
    return "TableType";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //----------------------------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: TableType): Observable<TableType> {
    return super.add(newObject);
  }

  override update(updatedObject: TableType): Observable<TableType> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  override searchByName(term: string): Observable<TableType[]> {
    return super.searchByName(term);
  }

  override sortEntities(entities: TableType[], field: keyof TableType, ascending: boolean): Observable<TableType[]> {
    return super.sortEntities(entities, field, ascending);
  }

  //----------------------------------------------------------------------------------------------------------------

}
