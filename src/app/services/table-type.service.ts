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

  gets(): Observable<TableType[]> {

    if (this.tableTypesCache) {
      return of(this.tableTypesCache);
    }

    const tableTypesObservable = this.apiService.request<TableType[]>('get', this.tableTypesUrl);

    tableTypesObservable.subscribe(data => {
      this.tableTypesCache = data;
    });

    return tableTypesObservable;
  }

  private isInCache(name: string, idToExclude: number | null = null): boolean {
    const isTableTypeInCache = this.tableTypesCache?.some(
      (cache) =>
        cache.tableTypeName.toLowerCase() === name.toLowerCase() && cache.tableTypeId !== idToExclude
    );

    if (isTableTypeInCache) {
      console.log("Danh mục này đã có rồi");
    }

    return isTableTypeInCache || false;
  }

  add(newObject: TableType): Observable<TableType> {
    if (this.tableTypesCache) {
      if (this.isInCache(newObject.tableTypeName)) {
        return of();
      }
    }
    return this.apiService.request<TableType>('post', this.tableTypeUrl, newObject).pipe(
      tap((added: TableType) => {
        this.tableTypesCache = [...this.tableTypesCache, added];
        localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));
      })
    );
  }

  update(updatedObject: TableType): Observable<any> {
    if (this.tableTypesCache) {
      if (this.isInCache(updatedObject.tableTypeName, updatedObject.tableTypeId)) {
        return of();
      }
    }
    const url = `${this.tableTypeUrl}`;
    return this.apiService.request('put', url, updatedObject).pipe(
      tap(() => {
        const updatedCategories = this.tableTypesCache.map((cache) =>
          cache.tableTypeId === updatedObject.tableTypeId ? updatedObject : cache
        );
        this.tableTypesCache = updatedCategories;
        localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.tableTypeUrl}/${id}`;
    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const updated = this.tableTypesCache.filter(cache => cache.tableTypeId !== id);
        this.tableTypesCache = updated;
        localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));
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