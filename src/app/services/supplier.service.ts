import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Supplier } from '../interfaces/supplier';


@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private suppliersUrl = 'suppliers'; 
    suppliersCache!: Supplier[]; 
    private supplierUrl = 'supplier';
    constructor(private apiService: ApiService) { }
    
    getSuppliers(): Observable<Supplier[]> {
        
        if (this.suppliersCache) {

            return of(this.suppliersCache);

        }

        const suppliersObservable = this.apiService.request<Supplier[]>('get', this.suppliersUrl);

        suppliersObservable.subscribe(data => {

            this.suppliersCache = data;

        });

        return suppliersObservable;
        
    }

    getSupplier(id: number): Observable<Supplier> {
      
        if (!this.suppliersCache) {
           
           this.getSuppliers();

        }
  
        const SupplierFromCache = this.suppliersCache.find(Supplier => Supplier.supplierId === id);

        if (SupplierFromCache) {
           
            return of(SupplierFromCache);

        } else {
          
            const url = `${this.supplierUrl}/${id}`;
            return this.apiService.request<Supplier>('get', url);

        }

    }
   
    addSupplier(newSupplier: Supplier): Observable<Supplier> {

        return this.apiService.request<Supplier>('post', this.suppliersUrl, newSupplier).pipe(

            tap((addedSupplier: Supplier) => {

                this.suppliersCache.push(addedSupplier);
                localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));

            })

        );

    }

    updateSupplier(updatedSupplier: Supplier): Observable<any> {

        const url = `${this.supplierUrl}/${updatedSupplier.supplierId}`;

        return this.apiService.request('put', url, updatedSupplier).pipe(

            tap(() => {
                
                const index = this.suppliersCache!.findIndex(supplier => supplier.supplierId === updatedSupplier.supplierId);

                if (index !== -1) {

                    this.suppliersCache![index] = updatedSupplier;
                    localStorage.setItem('suppliers', JSON.stringify(this.suppliersCache));

                }
            })

        );

    }

    updateSupplierCache(updatedSupplier: Supplier): void {
    
        if (this.suppliersCache) {

            const index = this.suppliersCache.findIndex(cat => cat.supplierId === updatedSupplier.supplierId);

            if (index !== -1) {

                this.suppliersCache[index] = updatedSupplier;

            }
        }
    }
   
    deleteSupplier(id: number): Observable<any> {

        const url = `${this.supplierUrl}/${id}`;
        return this.apiService.request('delete', url);

    }
    
}