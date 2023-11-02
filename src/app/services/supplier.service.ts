import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Supplier } from '../interfaces/supplier';


@Injectable({
    providedIn: 'root'
})
export class SupplierService {

    private suppliersUrl = 'suppliers'; // URL to web api, không cần thêm base URL
    suppliersCache!: Supplier[]; // Cache for categories
    private supplierUrl = 'supplier';
    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getSuppliers(): Observable<Supplier[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.suppliersCache) {
            return of(this.suppliersCache);
        }

        const suppliersObservable = this.apiService.request<Supplier[]>('get', this.suppliersUrl);

        // Cache the categories observable
        suppliersObservable.subscribe(data => {
            this.suppliersCache = data; // Store the fetched data in the cache
        });

        return suppliersObservable;
    }
    getSupplier(id: number): Observable<Supplier> {
        // Check if categoriesCache is null or empty
        if (!this.suppliersCache) {
            // Fetch the data from the API if cache is empty
           this.getSuppliers();
        }

        // Try to find the Category in the cache by its id
        const SupplierFromCache = this.suppliersCache.find(Supplier => Supplier.supplierId === id);

        if (SupplierFromCache) {
            // If found in cache, return it as an observable
            return of(SupplierFromCache);
        } else {
            // If not found in cache, fetch it from the API
            const url = `${this.supplierUrl}/${id}`;
            return this.apiService.request<Supplier>('get', url);
        }
    }
    // Thêm sản phẩm mới
    addSupplier(newSupplier: Supplier): Observable<Supplier> {
        return this.apiService.request<Supplier>('post', this.supplierUrl, newSupplier);
    }

    // Cập nhật sản phẩm
    updateSupplier(updatedSupplier: Supplier): Observable<any> {
        const url = `${this.supplierUrl}/${updatedSupplier.supplierId}`;
        return this.apiService.request('put', url, updatedSupplier).pipe(
            tap(() => {
                // Cập nhật danh sách cache sau khi cập nhật danh mục
                const index = this.suppliersCache!.findIndex(cat => cat.supplierId === updatedSupplier.supplierId);
                if (index !== -1) {
                    this.suppliersCache![index] = updatedSupplier;
                    localStorage.setItem('suppliers', JSON.stringify(this.suppliersCache));
                }
            })
        );
    }
    updateSupplierCache(updatedSupplier: Supplier): void {
        // Check if categoriesCache is null
        if (this.suppliersCache) {
            const index = this.suppliersCache.findIndex(cat => cat.supplierId === updatedSupplier.supplierId);
            if (index !== -1) {
                this.suppliersCache[index] = updatedSupplier;
            }
        }
    }
    // Xoá sản phẩm
    deleteSupplier(id: number): Observable<any> {
        const url = `${this.supplierUrl}/${id}`;
        return this.apiService.request('delete', url);
    }
}