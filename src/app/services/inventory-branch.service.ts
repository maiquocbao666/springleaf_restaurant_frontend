import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { InventoryBranch } from '../interfaces/inventory-branch';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryBranchService {

    private inventoryBranchesUrl = 'inventoryBranches';
    private inventoryBranchUrl = 'inventoryBranch';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private inventoryBranchesCacheSubject = new BehaviorSubject<InventoryBranch[]>([]);
    inventoryBranchesCache$ = this.inventoryBranchesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get inventoryBranchesCache(): InventoryBranch[] {
        return this.inventoryBranchesCacheSubject.value;
    }

    set inventoryBranchesCache(value: InventoryBranch[]) {
        this.inventoryBranchesCacheSubject.next(value);
    }

    gets(): Observable<InventoryBranch[]> {
        if (this.inventoryBranchesCache) {
            return of(this.inventoryBranchesCache);
        }

        const inventoryBranchesObservable = this.apiService.request<InventoryBranch[]>('get', this.inventoryBranchesUrl);

        inventoryBranchesObservable.subscribe(data => {
            this.inventoryBranchesCache = data;
        });

        return inventoryBranchesObservable;
    }

    getById(id: number): Observable<InventoryBranch> {

        if(!id){
            return of();
        }

        if (!this.inventoryBranchesCache) {
            this.gets();
        }

        const inventoryBranchFromCache = this.inventoryBranchesCache.find(branch => branch.inventoryBranchId === id);

        if (inventoryBranchFromCache) {
            return of(inventoryBranchFromCache);
        } else {
            const url = `${this.inventoryBranchUrl}/${id}`;
            return this.apiService.request<InventoryBranch>('get', url);
        }
    }

    // private isInventoryBranchNameInCache(name: string): boolean {
    //     const isTrue = !!this.inventoryBranchesCache?.find(branch => branch.name.toLowerCase() === name.toLowerCase());
    //     if(isTrue){
    //         console.log("Chi nhánh này đã có trong cache.");
    //         return isTrue;
    //     } else {
    //         return isTrue;
    //     }
    // }

    add(newInventoryBranch: InventoryBranch): Observable<InventoryBranch> {
        // if (this.isInventoryBranchNameInCache(newInventoryBranch.)) {
        //     // Nếu đã có chi nhánh có tên tương tự, trả về Observable với giá trị hiện tại
        //     return of();
        // }

        return this.apiService.request<InventoryBranch>('post', this.inventoryBranchUrl, newInventoryBranch).pipe(
            tap((addedInventoryBranch: InventoryBranch) => {
                this.inventoryBranchesCache = [...this.inventoryBranchesCache, addedInventoryBranch];
                localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));
            })
        );
    }

    update(updatedInventoryBranch: InventoryBranch): Observable<any> {
        // if (this.isInventoryBranchNameInCache(updatedInventoryBranch.name)) {
        //     // Nếu đã có chi nhánh có tên tương tự, trả về Observable với giá trị hiện tại
        //     return of();
        // }

        const url = `${this.inventoryBranchUrl}/${updatedInventoryBranch.inventoryBranchId}`;

        return this.apiService.request('put', url, updatedInventoryBranch).pipe(
            tap(() => {
                const index = this.inventoryBranchesCache!.findIndex(branch => branch.inventoryBranchId === updatedInventoryBranch.inventoryBranchId);
                if (index !== -1) {
                    this.inventoryBranchesCache![index] = updatedInventoryBranch;
                    localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));
                }
            })
        );
    }

    updateCache(updatedInventoryBranch: InventoryBranch): void {
        if (this.inventoryBranchesCache) {
            const index = this.inventoryBranchesCache.findIndex(branch => branch.inventoryBranchId === updatedInventoryBranch.inventoryBranchId);
            if (index !== -1) {
                this.inventoryBranchesCache[index] = updatedInventoryBranch;
            }
        }
    }

    delete(id: number): Observable<any> {
        const url = `${this.inventoryBranchUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const index = this.inventoryBranchesCache.findIndex(branch => branch.inventoryBranchId === id);
                if (index !== -1) {
                    this.inventoryBranchesCache.splice(index, 1);
                    localStorage.setItem(this.inventoryBranchesUrl, JSON.stringify(this.inventoryBranchesCache));
                }
            })
        );
    }
}