import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';


@Injectable({
  providedIn: 'root'
})
export class TableTypeService {

  private tableTypesUrl = 'tableTypes';
  private tableTypeUrl = 'tableType';
  tableTypesCache!: TableType[];

  constructor(private apiService: ApiService) { }

  getTableTypes(): Observable<TableType[]> {

    if (this.tableTypesCache) {

      return of(this.tableTypesCache);

    }

    const tableTypesObservable = this.apiService.request<TableType[]>('get', this.tableTypesUrl);


    tableTypesObservable.subscribe(data => {

      this.tableTypesCache = data;

    });

    return tableTypesObservable;

  }


  getTableTypeById(id: number): Observable<TableType | null> {

    if(!id){
      return of(null);
    }

    if (!this.tableTypesCache) {

      this.getTableTypes();

    }

    const TableTypeFromCache = this.tableTypesCache.find(TableType => TableType.tableTypeId === id);

    if (TableTypeFromCache) {

      return of(TableTypeFromCache);

    } else {

      const url = `${this.tableTypeUrl}/${id}`;

      return this.apiService.request<TableType>('get', url);

    }

  }

  addTableType(newTableType: TableType): Observable<TableType> {
    // Check if the table type already exists in the cache
    const existingTableType = this.tableTypesCache.find(
      (tableType) => tableType.tableTypeName === newTableType.tableTypeName
    );
  
    if (existingTableType) {
      console.log("Tên bàn này đã có rồi");
      return of(existingTableType);
    }
  
    // If not in the cache, make the API request
    return this.apiService
      .request<TableType>('post', this.tableTypeUrl, newTableType)
      .pipe(
        tap((addedTableType: TableType) => {
          // Add the new table type to the cache
          this.tableTypesCache.push(addedTableType);
          localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));
        })
      );
  }

  updateTableType(updatedtableType: TableType): Observable<any> {

    const url = `${this.tableTypeUrl}/${updatedtableType.tableTypeId}`;

    return this.apiService.request('put', url, updatedtableType).pipe(

      tap(() => {

        const index = this.tableTypesCache!.findIndex(tableType => tableType.tableTypeId === updatedtableType.tableTypeId);

        if (index !== -1) {

          this.tableTypesCache![index] = updatedtableType;
          localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));

        }

      })

    );

  }

  deleteTableType(id: number): Observable<any> {

    const url = `${this.tableTypeUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(

      tap(() => {

        const index = this.tableTypesCache.findIndex(tableType => tableType.tableTypeId === id);

        if (index !== -1) {

          this.tableTypesCache.splice(index, 1);
          localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));

        }

      })
    );

  }

  updateTableTypesCache(updatedTableType: TableType): void {

    if (this.tableTypesCache) {

        const index = this.tableTypesCache.findIndex(tableType => tableType.tableTypeId === updatedTableType.tableTypeId);

        if (index !== -1) {

            this.tableTypesCache[index] = updatedTableType;

        }
    }
}
}