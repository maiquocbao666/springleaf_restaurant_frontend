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

  apisUrl = 'products';
  
  cacheKey = 'products';

  apiUrl = 'product';

  categoryUrl = "category";

  //-------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //-------------------------------------------------------------------------------------------------

  getItemId(item: Product): number {
    return item.menuItemId!;
  }

  getItemName(item: Product): string {
    return item.name;
  }

  getObjectName(): string {
    return "Product";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-------------------------------------------------------------------------------------------------

  override add(newProduct: Product): Observable<Product> {
    return super.add(newProduct);
  }

  override update(updated: Product): Observable<any> {
    return super.update(updated);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  //-------------------------------------------------------------------------------------------------

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