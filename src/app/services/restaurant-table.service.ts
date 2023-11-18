import { RestaurantTable } from './../interfaces/restaurant-table';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TableStatusService } from './table-status.service';
import { ReservationService } from './reservation.service';



@Injectable({
    providedIn: 'root'
})
export class RestaurantTableService {

    private restaurantTablesUrl = 'restaurantTables';
    private restaurantTableUrl = 'restaurantTable';
    restaurantTablesCache!: RestaurantTable[];
    constructor(
        private apiService: ApiService,
        private tableStatusService: TableStatusService,
        private reservationService: ReservationService,
    ) {

    }

    getRestaurantTables(): Observable<RestaurantTable[]> {

        if (this.restaurantTablesCache) {

            return of(this.restaurantTablesCache);

        }

        const restaurantTablesObservable = this.apiService.request<RestaurantTable[]>('get', this.restaurantTablesUrl);

       
        restaurantTablesObservable.subscribe(data => {
            this.restaurantTablesCache = data;
        });

        return restaurantTablesObservable;

    }

    getRestaurantTableById(id: number): Observable<RestaurantTable | null> {

        if (!id) {
          return of(null);
        }
    
        if (!this.restaurantTablesCache) {
    
          this.getRestaurantTables();
    
        }
    
        const restaurantTableFromCache = this.restaurantTablesCache.find(restaurantTable => restaurantTable.tableId === id);
    
        if (restaurantTableFromCache) {
    
          return of(restaurantTableFromCache);
    
        } else {
    
          const url = `${this.restaurantTableUrl}/${id}`;
          return this.apiService.request<RestaurantTable>('get', url);
    
        }
    
      }

    addRestaurantTable(newRestaurantTable: RestaurantTable): Observable<RestaurantTable> {

        return this.apiService.request<RestaurantTable>('post', this.restaurantTableUrl, newRestaurantTable).pipe(

            tap((addedRestaurantTable: RestaurantTable) => {

                this.restaurantTablesCache.push(addedRestaurantTable);
                localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));

            })

        );

    }

    deleteRestaurantTable(id: number): Observable<any> {

        

        const url = `${this.restaurantTableUrl}/${id}`;
    
        return this.apiService.request('delete', url).pipe(
    
            tap(() => {
    
                const index = this.restaurantTablesCache.findIndex(restaurantTable => restaurantTable.tableId === id);
    
                if (index !== -1) {
    
                    this.restaurantTablesCache.splice(index, 1);
                    localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));
    
                }
    
            })
        );
    
    }
    

    updateRestaurantTable(updatedRestaurantTable: RestaurantTable): Observable<any> {

        const url = `${this.restaurantTableUrl}/${updatedRestaurantTable.tableId}`;

        return this.apiService.request('put', url, updatedRestaurantTable).pipe(

            tap(() => {
                
                const index = this.restaurantTablesCache!.findIndex(restaurantTable => restaurantTable.tableId === updatedRestaurantTable.tableId);

                if (index !== -1) {
                    
                    this.restaurantTablesCache![index] = updatedRestaurantTable;
                    localStorage.setItem(this.restaurantTablesUrl, JSON.stringify(this.restaurantTablesCache));

                }

            })
        );
    }


    updateRestaurantTableCache(updatedRestaurantTable: RestaurantTable): void {
        
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


    // Các chức năng tìm kiếm bàn

    findTableByStatusId(tableStatusId: number): boolean{
        const restaurantTable = this.restaurantTablesCache.find(restaurantTable => restaurantTable.tableStatusId === tableStatusId);
        if(restaurantTable){
            return true;
        }
        return false;
    }

    checkStatus(restaurantTableId: number): boolean {

        return true;
    }
    
}