import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Supplier } from '../interfaces/supplier';


@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private suppliersUrl = 'suppliers';
    private supplierUrl = 'supplier';
    suppliersCache!: Supplier[];
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

    getSupplierById(id: number): Observable<Supplier> {

        if (!this.suppliersCache) {

            this.getSuppliers();

        }

        const supplierFromCache = this.suppliersCache.find(supplier => supplier.supplierId === id);

        if (supplierFromCache) {

            return of(supplierFromCache);

        } else {

            const url = `${this.supplierUrl}/${id}`;
            return this.apiService.request<Supplier>('get', url);

        }

    }

    private isSupplierNameInCache(name: string): boolean {
        const isTrue = !!this.suppliersCache?.find(supplier => supplier.supplierName.toLowerCase() === name.toLowerCase());
        if (isTrue) {
            console.log('Quyền này đã tồn tại trong cache.');
            return isTrue;
        } else {
            return isTrue;
        }

    }

    addSupplier(newSupplier: Supplier): Observable<Supplier> {
    
        if (this.isSupplierNameInCache(newSupplier.supplierName)) {
            // Nếu đã có supplier có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }
    
        // Nếu không có supplier có tên tương tự trong cache, tiếp tục thêm supplier mới
        return this.apiService.request<Supplier>('post', this.supplierUrl, newSupplier).pipe(
            tap((addedSupplier: Supplier) => {
                this.suppliersCache.push(addedSupplier);
                localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));
            })
        );
    }

    updateSupplier(updatedSupplier: Supplier): Observable<any> {

        if (this.isSupplierNameInCache(updatedSupplier.supplierName)) {
            // Nếu đã có supplier có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        const url = `${this.supplierUrl}/${updatedSupplier.supplierId}`;

        return this.apiService.request('put', url, updatedSupplier).pipe(

            tap(() => {

                const index = this.suppliersCache!.findIndex(supplier => supplier.supplierId === updatedSupplier.supplierId);

                if (index !== -1) {

                    this.suppliersCache![index] = updatedSupplier;
                    localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));

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

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.suppliersCache.findIndex(supplier => supplier.supplierId === id);

                if (index !== -1) {

                    this.suppliersCache.splice(index, 1);
                    localStorage.setItem(this.suppliersUrl, JSON.stringify(this.suppliersCache));

                }

            })
        );

    }


}