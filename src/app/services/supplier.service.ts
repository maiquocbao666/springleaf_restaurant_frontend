import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Supplier } from '../interfaces/supplier';

@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private suppliersUrl = 'suppliers';
    private supplierUrl = 'supplier';
    private suppliersCacheSubject = new BehaviorSubject<Supplier[]>([]);
    suppliersCache$ = this.suppliersCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get suppliersCache(): Supplier[] {
        return this.suppliersCacheSubject.value;
    }

    set suppliersCache(value: Supplier[]) {
        this.suppliersCacheSubject.next(value);
    }

    private updateCache(updatedSupplier: Supplier): void {
        const index = this.suppliersCache.findIndex(supplier => supplier.supplierId === updatedSupplier.supplierId);
        if (index !== -1) {
            const updatedCache = [...this.suppliersCache];
            updatedCache[index] = updatedSupplier;
            this.suppliersCache = updatedCache;
        }
    }

    getSuppliers(): Observable<Supplier[]> {

        if (this.suppliersCache.length > 0) {
            return of(this.suppliersCache);
        }

        const suppliersObservable = this.apiService.request<Supplier[]>('get', this.suppliersUrl);

        suppliersObservable.subscribe(data => {
            this.suppliersCache = data;
        });

        return suppliersObservable;
    }

    private isSupplierNameInCache(name: string): boolean {
        return !!this.suppliersCache?.find(supplier => supplier.supplierName.toLowerCase() === name.toLowerCase());
    }

    addSupplier(newSupplier: Supplier): Observable<Supplier> {

        if (this.isSupplierNameInCache(newSupplier.supplierName)) {
            return of();
        }

        return this.apiService.request<Supplier>('post', this.supplierUrl, newSupplier).pipe(
            tap((addedSupplier: Supplier) => {
                this.suppliersCache = [...this.suppliersCache, addedSupplier];
            })
        );
    }

    updateSupplier(updatedSupplier: Supplier): Observable<any> {

        if (this.isSupplierNameInCache(updatedSupplier.supplierName)) {
            return of();
        }

        const url = `${this.supplierUrl}/${updatedSupplier.supplierId}`;

        return this.apiService.request('put', url, updatedSupplier).pipe(
            tap(() => {
                this.updateCache(updatedSupplier);
            })
        );
    }

    deleteSupplier(id: number): Observable<any> {

        const url = `${this.supplierUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.suppliersCache.filter(supplier => supplier.supplierId !== id);
                this.suppliersCache = updatedCache;
            })
        );
    }

    getSupplierById(id: number): Observable<Supplier | null> {

        if (!id) {
          return of(null);
        }
    
        if (this.suppliersCache.length > 0) {
          const supplierFromCache = this.suppliersCache.find(supplier => supplier.supplierId === id);
          if (supplierFromCache) {
            return of(supplierFromCache);
          }
        }
    
        const url = `${this.supplierUrl}/${id}`;
    
        return this.apiService.request<Supplier>('get', url).pipe(
          tap((supplier: Supplier) => {
            // Update cache with the fetched supplier
            this.suppliersCache = [...this.suppliersCache, supplier];
          }),
          // Handle error or return null if the supplier is not found
          catchError(() => of(null))
        );
      }

}