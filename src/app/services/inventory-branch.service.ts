import { InventoryBranch } from './../interfaces/inventory-branch';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class InventoryBranchService {

    private inventoryBranchesUrl = 'inventoryBranches'; // URL to web api, không cần thêm base URL
    inventoryBranchesCache!: InventoryBranch[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getInventoryBranches(): Observable<InventoryBranch[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.inventoryBranchesCache) {
            console.log("Có Inventories cache");
            return of(this.inventoryBranchesCache);
        }

        const inventoryBranchesObservable = this.apiService.request<InventoryBranch[]>('get', this.inventoryBranchesUrl);

        // Cache the categories observable
        inventoryBranchesObservable.subscribe(data => {
            this.inventoryBranchesCache = data; // Store the fetched data in the cache
        });

        return inventoryBranchesObservable;
    }



}