import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';


@Injectable({
  providedIn: 'root'
})
export class TableTypeService {

  private tableTypesUrl = 'tableTypesUrl';
  private tableTypeUrl = 'tableTypeUrl';
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


  getTableTypeById(id: number): Observable<TableType> {

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

    return this.apiService.request<TableType>('post', this.tableTypeUrl, newTableType).pipe(

      tap((addedTableType: TableType) => {

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


}