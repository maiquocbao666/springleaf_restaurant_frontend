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

    gets(): Observable<Supplier[]> {

        if (this.suppliersCache) {
            return of(this.suppliersCache);
        }

        const suppliersObservable = this.apiService.request<Supplier[]>('get', this.suppliersUrl);

        suppliersObservable.subscribe(data => {
            this.suppliersCache = data;
        });

        return suppliersObservable;
    }

    private isInCache(name: string, idToExclude: number | null = null): boolean {
        const isSupplierInCache = this.suppliersCache?.some(
            (cache) =>
                cache.supplierName.toLowerCase() === name.toLowerCase() && cache.supplierId !== idToExclude
        );

        if (isSupplierInCache) {
            console.log("Supplier này đã có rồi");
        }

        return isSupplierInCache || false;
    }

    add(newObject: Supplier): Observable<Supplier> {
        if (this.suppliersCache) {
            if (this.isInCache(newObject.supplierName)) {
                return of();
            }
        }
        return this.apiService.request<Supplier>('post', this.supplierUrl, newObject).pipe(
            tap((added: Supplier) => {
                this.suppliersCache = [...this.suppliersCache, added];
                localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));
                //this.onSendMessage(this.suppliersUrl);
            })
        );
    }

    update(updatedObject: Supplier): Observable<any> {
        if (this.suppliersCache) {
            if (this.isInCache(updatedObject.supplierName, updatedObject.supplierId)) {
                return of();
            }
        }
        const url = `${this.supplierUrl}`;
        return this.apiService.request('put', url, updatedObject).pipe(
            tap(() => {
                const updatedObjects = this.suppliersCache.map((cache) =>
                    cache.supplierId === updatedObject.supplierId ? updatedObject : cache
                );
                this.suppliersCache = updatedObjects;
                localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));
                //this.onSendMessage(this.suppliersUrl);
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.supplierUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updated = this.suppliersCache.filter(cache => cache.supplierId !== id);
                this.suppliersCache = updated;
                localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));
                //this.onSendMessage(this.suppliersUrl);
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