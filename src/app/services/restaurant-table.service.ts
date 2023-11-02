import { RestaurantTable } from './../interfaces/restaurant-table';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';



@Injectable({
    providedIn: 'root'
})
export class RestaurantTableService {

    private restaurantTablesUrl = 'restaurantTables'; // URL to web api, không cần thêm base URL
    restaurantTablesCache: RestaurantTable[] | null = null; // Cache for categories
    private restaurantTableUrl = 'restaurantTable';
    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getRestaurantTables(): Observable<RestaurantTable[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.restaurantTablesCache) {
            return of(this.restaurantTablesCache);
        }

        const restaurantTablesObservable = this.apiService.request<RestaurantTable[]>('get', this.restaurantTablesUrl);

        // Cache the categories observable
        restaurantTablesObservable.subscribe(data => {
            this.restaurantTablesCache = data; // Store the fetched data in the cache
        });

        return restaurantTablesObservable;
    }

    // Thêm sản phẩm mới
    addRestaurantTable(newRestaurantTable: RestaurantTable): Observable<RestaurantTable> {
        return this.apiService.request<RestaurantTable>('post', this.restaurantTableUrl, newRestaurantTable);
    }
    deleteTable(id: number): Observable<any> {
        const url = `${this.restaurantTableUrl}/${id}`;
        return this.apiService.request('delete', url);
    }

    // Cập nhật sản phẩm
    updateRestaurantTable(updatedRestaurantTable: RestaurantTable): Observable<any> {
        const url = `${this.restaurantTableUrl}/${updatedRestaurantTable.tableId}`;
        return this.apiService.request('put', url, updatedRestaurantTable).pipe(
            tap(() => {
                // Cập nhật danh sách cache sau khi cập nhật danh mục
                const index = this.restaurantTablesCache!.findIndex(cat => cat.tableId === updatedRestaurantTable.tableId);
                if (index !== -1) {
                    this.restaurantTablesCache![index] = updatedRestaurantTable;
                    localStorage.setItem('restaurantTables', JSON.stringify(this.restaurantTablesCache));
                }
            })
        );
    }


    updateRestaurantTableCache(updatedRestaurantTable: RestaurantTable): void {
        // Check if categoriesCache is null
        if (this.restaurantTablesCache) {
          const index = this.restaurantTablesCache.findIndex(cat => cat.tableId === updatedRestaurantTable.tableId);
          if (index !== -1) {
            this.restaurantTablesCache[index] = updatedRestaurantTable;
          }
        }
      }
      
      resetAutoIncrement(): Observable<string> {
        return this.apiService.request<string>('post', 'reset/id', {});
    }
    
}