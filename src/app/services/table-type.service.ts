import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableType } from '../interfaces/table-type';


@Injectable({
  providedIn: 'root'
})
export class TableTypeService {

  private tableTypesUrl = 'tableTypes'; // URL to web api, không cần thêm base URL
  tableTypesCache!: TableType[]; // Cache for categories
  private tableTypeUrl = 'tableType';
  constructor(private apiService: ApiService) { } // Inject ApiService

  // Sử dụng ApiService để gửi yêu cầu GET
  getTableTypes(): Observable<TableType[]> {
    // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
    if (this.tableTypesCache) {
      return of(this.tableTypesCache);
    }

    const tableTypesObservable = this.apiService.request<TableType[]>('get', this.tableTypesUrl);

    // Cache the categories observable
    tableTypesObservable.subscribe(data => {
      this.tableTypesCache = data; // Store the fetched data in the cache
    });

    return tableTypesObservable;
  }
  
  // Lấy tên theo ID
  getTableTypeById(id: number): Observable<TableType> {
    // Check if categoriesCache is null or empty
    if (!this.tableTypesCache) {
      this.getTableTypes();
    }

    // Tìm tableType trong tableTypesCache theo id
    const TableTypeFromCache = this.tableTypesCache.find(TableType => TableType.tableTypeId === id);

    if (TableTypeFromCache) {
      // Nếu tìm thấy trong tableTypesCache thì return về 1 ObserVable<TableType>
      return of(TableTypeFromCache);
    } else {
      // Nếu kiếm không thấy trong tableTypesCache thì trả về dữ liệu lấy từ api
      const url = `${this.tableTypeUrl}/${id}`;
      return this.apiService.request<TableType>('get', url);
    }
  }


}