import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';

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

  constructor(private apiService: ApiService) { }

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
      this.productsCache = data;
    });

    return productsObservable;
  }

  getById(id: number): Observable<Product> {

    if (!id) {
      return of();
    }

    if (!this.productsCache) {
      this.gets();
    }

    const productFromCache = this.productsCache.find(product => product.menuItemId === id);

    if (productFromCache) {
      return of(productFromCache);
    } else {
      const url = `${this.productsUrl}/${id}`;
      return this.apiService.request<Product>('get', url);
    }
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    if (this.productsCache.length > 0) {
      const products = this.productsCache.filter(product => product.categoryId === categoryId);
      return of(products);
    }

    const url = `${this.categoryUrl}/${categoryId}/products`;
    return this.apiService.request<Product[]>('get', url);
  }

  private isProductNameInCache(name: string): boolean {
    const isTrue = !!this.productsCache?.find(product => product.name.toLowerCase() === name.toLowerCase());
    if (isTrue) {
      console.log('Món ăn này đã tồn tại trong cache.');
      return isTrue;
    } else {
      return isTrue;
    }
  }

  add(newProduct: Product): Observable<Product> {
    if (this.productsCache.length > 0) {
      if (this.isProductNameInCache(newProduct.name)) {
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

  update(updatedProduct: Product): Observable<any> {
    if (this.productsCache.length > 0) {
      if (this.isProductNameInCache(updatedProduct.name)) {
        return of();
      }
    }

    const url = `${this.productUrl}`;

    return this.apiService.request('put', url, updatedProduct).pipe(
      tap(() => {
        const updatedProducts = this.productsCache.map(product =>
          product.menuItemId === updatedProduct.menuItemId ? updatedProduct : product
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