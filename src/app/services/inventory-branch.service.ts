import { InventoryBranch } from './../interfaces/inventory-branch';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class InventoryBranchService {

    private inventoryBranchesUrl = 'inventoryBranches';
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



}