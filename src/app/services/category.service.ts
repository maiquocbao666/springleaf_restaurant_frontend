import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';
import { Category } from '../interfaces/category';

import { Observable, of } from 'rxjs';
import { BaseService } from './base-service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {

  //----------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService,
    private productService: ProductService,
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //----------------------------------------------------------------------

  apisUrl = 'categories';
  cacheKey = 'categories';
  apiUrl = 'category';

  //----------------------------------------------------------------------

  getItemId(item: Category): number {
    return item.categoryId!;
  }

  getItemName(item: Category): string {
    return item.name;
  }

  getObjectName(): string {
    return 'Category';
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //--------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: Category): Observable<Category> {
    if (this.isNameInCache(newObject.name, newObject.categoryId)) {
      return of();
    }
    return super.add(newObject);
  }

  override update(updateObject: Category): Observable<Category> {
    const isNameInCache = this.isNameInCache(updateObject.name, updateObject.categoryId);

    if (isNameInCache) {
      return of();
    }

    this.productService.updateProductsStatusByCategoryId(updateObject.categoryId!, updateObject.active);

    return super.update(updateObject);
  }

  override delete(id: number): Observable<any> {
    this.productService.getProductsByCategoryId(id).subscribe(productsWithCategory => {
      if (productsWithCategory.length > 0) {
        this.sweetAlertService.showTimedAlert(`Không thể xóa!`, '', 'error', 2000);
      } else {
        super.delete(id);
      }
    });
    return of();
  }

  override searchByName(term: string): Observable<Category[]> {
    return super.searchByName(term);
  }

  override sortEntities(entities: Category[], field: keyof Category, ascending: boolean): Observable<Category[]> {
    return super.sortEntities(entities, field, ascending);
  }

  //---------------------------------------------------------------------------------------------------------

  private isNameInCache(name: string, idToExclude: number | null = null): boolean {
    let isInCache = false;
    isInCache = this.cache.some(
      (item) => item.name.toLowerCase() === name.toLowerCase() && item.categoryId !== idToExclude
    );
    if (isInCache) {
      this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã có rồi!`, '', 'error', 2000);
    }
    return isInCache;
  }

  //---------------------------------------------------------------------------------------------------------------

}