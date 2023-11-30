import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { HttpHeaders } from '@angular/common/http';

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

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    if (this.cache$) {
      return this.cache$.pipe(
        map(cache => cache.filter(item => item.categoryId === categoryId))
      );
    }
    const url = `${this.categoryUrl}/${categoryId}/products`;
    return this.apiService.request<Product[]>('get', url);
  }

  addToCart(menuItemId: number, deliveryOrderId: number, orderId: number): Observable<any> {
    const jwtToken = localStorage.getItem('access_token');
    
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });
    
    // Thêm các tham số vào URL
    const url = `addToCart/${menuItemId}/${deliveryOrderId}/${orderId}`;
  
    return this.apiService.request<any>('post', url, null, customHeader);
    
  }
  

}