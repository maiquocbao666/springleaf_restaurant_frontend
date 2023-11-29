import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Supplier } from '../interfaces/supplier';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class SupplierService extends BaseService<Supplier>  {

    //--------------------------------------------------------------------------------------------------------

    apisUrl = 'suppliers';
    cacheKey = 'suppliers';
    apiUrl = 'supplier';

    //--------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //--------------------------------------------------------------------------------------------------------

    getItemId(item: Supplier): number {
        return item.supplierId!;
    }

    getItemName(item: Supplier): string {
        return item.supplierName;
    }

    getObjectName(): string {
        return "Supplier";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //--------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(newObject: Supplier): Observable<Supplier> {
        return super.add(newObject);
    }

    override update(updatedObject: Supplier): Observable<Supplier> {
        return super.update(updatedObject);
    }

    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    override searchByName(term: string): Observable<Supplier[]> {
        return super.searchByName(term);
    }

    //--------------------------------------------------------------------------------------------------------


    // private updateCache(updatedSupplier: Supplier): void {
    //     const index = this.suppliersCache.findIndex(supplier => supplier.supplierId === updatedSupplier.supplierId);
    //     if (index !== -1) {
    //         const updatedCache = [...this.suppliersCache];
    //         updatedCache[index] = updatedSupplier;
    //         this.suppliersCache = updatedCache;
    //     }
    // }

    // private isInCache(name: string, idToExclude: number | null = null): boolean {
    //     const isSupplierInCache = this.suppliersCache?.some(
    //         (cache) =>
    //             cache.supplierName.toLowerCase() === name.toLowerCase() && cache.supplierId !== idToExclude
    //     );

    //     if (isSupplierInCache) {
    //         console.log("Supplier này đã có rồi");
    //     }

    //     return isSupplierInCache || false;
    // }

}