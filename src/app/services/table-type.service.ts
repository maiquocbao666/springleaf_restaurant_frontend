import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';


@Injectable({
  providedIn: 'root'
})
export class TableTypeService {

  private tableTypesUrl = 'tableTypes';
  tableTypesCache!: TableType[];
  private tableTypeUrl = 'tableType';
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

    return this.apiService.request<TableType>('post', this.tableTypesUrl, newTableType).pipe(

        tap((addedTableType: TableType) => {

            this.tableTypesCache.push(addedTableType);
            localStorage.setItem(this.tableTypesUrl, JSON.stringify(this.tableTypesCache));

        })

    );

}

}