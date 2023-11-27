import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<Product> {

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apisUrl = 'products';
  cacheKey = 'products';
  apiUrl = 'product';

  categoryUrl = "category";

  getItemId(item: Product): number {
    return item.menuItemId!;
  }
  getItemName(item: Product): string {
    return item.name;
  }
  getObjectName(): string {
    return "Product";
  }

  override gets(): Observable<Product[]> {
    return super.gets();
  }

  override add(newProduct: Product): Observable<Product> {
    return super.add(newProduct);
  }

  override update(updated: Product): Observable<any> {
    return super.update(updated);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  addToCart(productId: number): Observable<any> {
    const jwtToken = localStorage.getItem('access_token');
    console.log(jwtToken);
    const url = `product/addToCart?productId=${productId}`;
    return this.apiService.request('post', url);
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    if (this.cache$) {
      return this.cache$.pipe(
        map(cache => cache.filter(item => item.categoryId === categoryId))
      );
    }

    const url = `${this.categoryUrl}/${categoryId}/products`;
    return this.apiService.request<Product[]>('get', url);
  }

}