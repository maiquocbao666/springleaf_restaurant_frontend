import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inventory } from 'src/app/interfaces/inventory';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {

    private inventoriesUrl = 'inventories';
    private inventoryUrl = 'inventory';
    inventoriesCache!: Inventory[];

    constructor(private apiService: ApiService, private httpClient: HttpClient) { }


    getInventories(): Observable<Inventory[]> {

        if (this.inventoriesCache) {

            console.log("Có categories cache");
            return of(this.inventoriesCache);

        }

        console.log("Không có categories cache")

        const categoriesObservable = this.apiService.request<Inventory[]>('get', this.inventoriesUrl);

        categoriesObservable.subscribe(data => {

            this.inventoriesCache = data;

        });

        return categoriesObservable;

    }

    addInventory(newInventory: Inventory): Observable<Inventory> {

        return this.apiService.request<Inventory>('post', this.inventoryUrl, newInventory).pipe(

            tap((addedInventory: Inventory) => {

                this.inventoriesCache.push(addedInventory);
                localStorage.setItem(this.inventoriesUrl, JSON.stringify(this.inventoriesCache));

            })

        );

    }

    updateInventory(updatedInventory: Inventory): Observable<any> {

        const url = `${this.inventoryUrl}/${updatedInventory.inventoryId}`;

        return this.apiService.request('put', url, updatedInventory).pipe(

            tap(() => {

                this.updateInventoryCache(updatedInventory);

                const index = this.inventoriesCache!.findIndex(inventory => inventory.inventoryId === updatedInventory.inventoryId);

                if (index !== -1) {

                    this.inventoriesCache![index] = updatedInventory;
                    localStorage.setItem(this.inventoriesUrl, JSON.stringify(this.inventoriesCache));

                }

            })

        );

    }

    updateInventoryCache(updatedInventory: Inventory): void {

        if (this.inventoriesCache) {

            const index = this.inventoriesCache.findIndex(cat => cat.inventoryId === updatedInventory.inventoryId);

            if (index !== -1) {

                this.inventoriesCache[index] = updatedInventory;

            }

        }

    }

    deleteInventory(id: number): Observable<any> {

        const url = `${this.inventoryUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.inventoriesCache.findIndex(inventory => inventory.inventoryId === id);

                if (index !== -1) {

                    this.inventoriesCache.splice(index, 1);
                    localStorage.setItem(this.inventoriesUrl, JSON.stringify(this.inventoriesCache));

                }

            })
        );

    }




}
