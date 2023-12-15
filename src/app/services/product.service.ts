import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/product';
import { RxStompService } from '../rx-stomp.service';
import { ApiService } from './api.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<Product> {

  apisUrl = 'products';

  cacheKey = 'products';

  apiUrl = 'product';

  categoryUrl = "category";

  private apiPostUrl = 'http://localhost:8080/public/create/uploadImage';
  private apiGetUrl = 'http://localhost:8080/public/getImage';

  //-------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService,
    private http: HttpClient
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
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

  override subscribeToQueue(): void {
    super.subscribeToQueue();
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

  updateProductsStatusByCategoryId(categoryId: number, status: boolean): void {
    if (this.cache) {
      this.cache.forEach(item => {
        if (item.categoryId === categoryId) {
          item.status = status;
          this.update(item).subscribe(
            () => {
            },
            error => {
            }
          );
        }
      });
    }
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

 

  // getImagePath(imageName: string): Observable<Blob> {
  //   return this.http.get(`apiGetUrl/${imageName}`, { responseType: 'blob' });
  // }

  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(this.apiPostUrl, formData, { headers: headers });
  }


}