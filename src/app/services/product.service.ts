import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'products';
  private categoryUrl = 'category';
  private productUrl = 'product';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private productsCacheSubject = new BehaviorSubject<Product[]>([]);
  productsCache$ = this.productsCacheSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private sweetAlertService: ToastService,
  ) { }

  get productsCache(): Product[] {
    return this.productsCacheSubject.value;
  }

  set productsCache(value: Product[]) {
    this.productsCacheSubject.next(value);
  }

  gets(): Observable<Product[]> {

    if (this.productsCache) {
      return of(this.productsCache);
    }

    const productsObservable = this.apiService.request<Product[]>('get', this.productsUrl);

    productsObservable.subscribe(data => {

      if (this.productsCache !== data) {
        this.productsCache = data;
        return productsObservable;
      } else {
        return of(this.productsCache);
      }

    });

    return productsObservable;
  }

  getById(id: number): Observable<Product | null> {

    if (!id) {
      return of(null);
    }

    if (!this.productsCache.length) {

      this.gets();

    }

    const cache = this.productsCache.find(cache => cache.menuItemId === id);

    if (cache) {

      return of(cache);

    } else {

      const url = `${this.categoryUrl}/${id}`;
      return this.apiService.request<Product>('get', url);

    }

  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    if (this.productsCache) {
      const products = this.productsCache.filter(cache => cache.categoryId === categoryId);
      return of(products);
    }

    const url = `${this.categoryUrl}/${categoryId}/products`;
    return this.apiService.request<Product[]>('get', url);
  }

  private isInCache(name: string, IdToExclude: number | null = null): boolean {
    const isInCache = this.productsCache?.some(
      (cache) =>
        cache.name.toLowerCase() === name.toLowerCase() && cache.menuItemId !== IdToExclude
    );

    if (isInCache) {
      this.sweetAlertService.showTimedAlert('Product này đã có rồi!', '', 'error', 2000);
    }

    return isInCache || false;
  }

  add(newProduct: Product): Observable<Product> {
    if (this.productsCache.length > 0) {
      if (this.isInCache(newProduct.name)) {
        return of();
      }
    }

    return this.apiService.request<Product>('post', this.productUrl, newProduct).pipe(
      tap((addedProduct: Product) => {
        this.productsCache = [...this.productsCache, addedProduct];
        localStorage.setItem(this.productsUrl, JSON.stringify(this.productsCache));
      })
    );
  }

  update(updated: Product): Observable<any> {
    if (this.productsCache) {
      if (this.isInCache(updated.name)) {
        return of();
      }
    }

    const url = `${this.productUrl}`;

    return this.apiService.request('put', url, updated).pipe(
      tap(() => {
        const updatedProducts = this.productsCache.map(product =>
          product.menuItemId === updated.menuItemId ? updated : product
        );
        this.productsCache = updatedProducts;
        localStorage.setItem(this.productsUrl, JSON.stringify(updatedProducts));
      })
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.productUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const updatedProducts = this.productsCache.filter(product => product.menuItemId !== id);
        this.productsCache = updatedProducts;
        localStorage.setItem(this.productsUrl, JSON.stringify(updatedProducts));
      })
    );
  }

  addToCart(productId: number): Observable<any> {
    const jwtToken = localStorage.getItem('access_token');
    console.log(jwtToken);
    const url = `product/addToCart?productId=${productId}`;
    return this.apiService.request('post', url);
  }
}