import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';

@Injectable({
  providedIn: 'root'
})
export class TableTypeService {

  private tableTypesUrl = 'tableTypes';
  private tableTypeUrl = 'tableType';
  private tableTypesCacheSubject = new BehaviorSubject<TableType[]>([]);
  tableTypesCache$ = this.tableTypesCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get tableTypesCache(): TableType[] {
    return this.tableTypesCacheSubject.value;
  }

  set tableTypesCache(value: TableType[]) {
    this.tableTypesCacheSubject.next(value);
  }

  private updateCache(updatedTableType: TableType): void {
    const index = this.tableTypesCache.findIndex(tableType => tableType.tableTypeId === updatedTableType.tableTypeId);
    if (index !== -1) {
      const updatedCache = [...this.tableTypesCache];
      updatedCache[index] = updatedTableType;
      this.tableTypesCache = updatedCache;
    }
  }

  getTableTypes(): Observable<TableType[]> {

    if (this.tableTypesCache.length > 0) {
      return of(this.tableTypesCache);
    }

    const tableTypesObservable = this.apiService.request<TableType[]>('get', this.tableTypesUrl);

    tableTypesObservable.subscribe(data => {
      this.tableTypesCache = data;
    });

    return tableTypesObservable;
  }

  private isTableTypeNameInCache(name: string): boolean {
    return !!this.tableTypesCache?.find(tableType => tableType.tableTypeName.toLowerCase() === name.toLowerCase());
  }

  addTableType(newTableType: TableType): Observable<TableType> {

    if (this.isTableTypeNameInCache(newTableType.tableTypeName)) {
      return of();
    }

    return this.apiService.request<TableType>('post', this.tableTypeUrl, newTableType).pipe(
      tap((addedTableType: TableType) => {
        this.tableTypesCache = [...this.tableTypesCache, addedTableType];
      })
    );
  }

  updateTableType(updatedTableType: TableType): Observable<any> {

    if (this.isTableTypeNameInCache(updatedTableType.tableTypeName)) {
      return of();
    }

    const url = `${this.tableTypeUrl}/${updatedTableType.tableTypeId}`;

    return this.apiService.request('put', url, updatedTableType).pipe(
      tap(() => {
        this.updateCache(updatedTableType);
      })
    );
  }

  deleteTableType(id: number): Observable<any> {

    const url = `${this.tableTypeUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const updatedCache = this.tableTypesCache.filter(tableType => tableType.tableTypeId !== id);
        this.tableTypesCache = updatedCache;
      })
    );
  }

  getTableTypeById(id: number): Observable<TableType | null> {

    if (!id) {
      return of(null);
    }

    if (this.tableTypesCache.length > 0) {
      const tableTypeFromCache = this.tableTypesCache.find(tableType => tableType.tableTypeId === id);
      if (tableTypeFromCache) {
        return of(tableTypeFromCache);
      }
    }

    const url = `${this.tableTypeUrl}/${id}`;

    return this.apiService.request<TableType>('get', url).pipe(
      tap((tableType: TableType) => {
        // Update cache with the fetched table type
        this.tableTypesCache = [...this.tableTypesCache, tableType];
      }),
      // Handle error or return null if the table type is not found
      catchError(() => of(null))
    );
  }

}