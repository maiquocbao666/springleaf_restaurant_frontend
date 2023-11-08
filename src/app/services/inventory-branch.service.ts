import { InventoryBranch } from './../interfaces/inventory-branch';

import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class InventoryBranchService {

    private inventoryBranchesUrl = 'inventoryBranches';
    private inventoryBranchUrl = 'inventoryBranch';

    inventoryBranchesCache!: InventoryBranch[];

    constructor(private apiService: ApiService) { }


    getInventoryBranches(): Observable<InventoryBranch[]> {

        if (this.inventoryBranchesCache) {

            console.log("Có Inventories cache");
            return of(this.inventoryBranchesCache);

        }

        const inventoryBranchesObservable = this.apiService.request<InventoryBranch[]>('get', this.inventoryBranchesUrl);


        inventoryBranchesObservable.subscribe(data => {

            this.inventoryBranchesCache = data;

        });

        return inventoryBranchesObservable;

    }


    addInventoryBranch(newInventoryBranch: InventoryBranch): Observable<InventoryBranch> {

        return this.apiService.request<InventoryBranch>('post', this.inventoryBranchUrl, newInventoryBranch).pipe(

            tap((addedInventoryBranch: InventoryBranch) => {

                this.inventoryBranchesCache.push(addedInventoryBranch);
                localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));

            })

        );

    }

    updateInventoryBranche(updatedInventoryBranche: InventoryBranch): Observable<any> {

        const url = `${this.inventoryBranchUrl}/${updatedInventoryBranche.inventoryBranchId}`;

        return this.apiService.request('put', url, updatedInventoryBranche).pipe(

            tap(() => {

                const index = this.inventoryBranchesCache!.findIndex(inventoryBranche => inventoryBranche.inventoryBranchId === updatedInventoryBranche.inventoryBranchId);

                if (index !== -1) {

                    this.inventoryBranchesCache![index] = updatedInventoryBranche;
                    localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));

                }

            })

        );

    }

    deleteInventoryBranch(id: number): Observable<any> {

        const url = `${this.inventoryBranchUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.inventoryBranchesCache.findIndex(inventoryBranch => inventoryBranch.inventoryBranchId === id);

                if (index !== -1) {

                    this.inventoryBranchesCache.splice(index, 1);
                    localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));

                }

            })
        );

    }

}