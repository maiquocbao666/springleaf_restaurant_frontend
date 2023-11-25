import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Inventory } from 'src/app/interfaces/inventory';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {

    private inventoriesUrl = 'inventories';
    private inventoryUrl = 'inventory';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private inventoriesCacheSubject = new BehaviorSubject<Inventory[]>([]);
    inventoriesCache$ = this.inventoriesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get inventoriesCache(): Inventory[] {
        return this.inventoriesCacheSubject.value;
    }

    set inventoriesCache(value: Inventory[]) {
        this.inventoriesCacheSubject.next(value);
    }

    gets(): Observable<Inventory[]> {

        if (this.inventoriesCache) {
            return of(this.inventoriesCache);
        }

        const inventoriesObservable = this.apiService.request<Inventory[]>('get', this.inventoriesUrl);

        inventoriesObservable.subscribe(data => {
            this.inventoriesCache = data;
        });

        return inventoriesObservable;
    }

    

    add(newInventory: Inventory): Observable<Inventory> {

        return this.apiService.request<Inventory>('post', this.inventoryUrl, newInventory).pipe(

            tap((addedInventory: Inventory) => {

                this.inventoriesCache = [...this.inventoriesCache, addedInventory];
                localStorage.setItem(this.inventoriesUrl, JSON.stringify(this.inventoriesCache));

            })

        );

    }

    update(updatedInventory: Inventory): Observable<any> {

        const url = `${this.inventoryUrl}/${updatedInventory.inventoryId}`;

        return this.apiService.request('put', url, updatedInventory).pipe(

            tap(() => {

                this.updateCache(updatedInventory);

                const index = this.inventoriesCache!.findIndex(inventory => inventory.inventoryId === updatedInventory.inventoryId);

                if (index !== -1) {

                    this.inventoriesCache![index] = updatedInventory;
                    localStorage.setItem(this.inventoriesUrl, JSON.stringify(this.inventoriesCache));

                }

            })

        );

    }

    updateCache(updatedInventory: Inventory): void {

        if (this.inventoriesCache) {

            const index = this.inventoriesCache.findIndex(inv => inv.inventoryId === updatedInventory.inventoryId);

            if (index !== -1) {

                this.inventoriesCache[index] = updatedInventory;

            }

        }

    }

    delete(id: number): Observable<any> {

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