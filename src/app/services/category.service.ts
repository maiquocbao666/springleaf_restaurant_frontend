import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';
import { Category } from '../interfaces/category';

import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  apisUrl = 'categories';
  cacheKey = 'categories';
  apiUrl = 'category';

  getItemId(item: Category): number {
    return item.categoryId!;
  }
  getItemName(item: Category): string {
    return item.name;
  }
  getObjectName(): string {
    return 'Category';
  }

  override gets(): Observable<any[]> {
    return super.gets();
  }
  override getById(id: number): Observable<Category | null> {
    return super.getById(id);
  }
  override add(newObject: Category): Observable<Category> {
    return super.add(newObject);
  }
  override update(updateObject: Category): Observable<Category> {
    return super.update(updateObject);
  }
  override delete(id : number): Observable<any> {
    return super.delete(id);
  }
  override searchByName(term: string): Observable<Category[]> {
    return super.searchByName(term);
  }

  // private isInCache(name: string, idToExclude: number | null = null): boolean {
  //   let isInCache = false;

  //   this.cache$.subscribe(cache => {
  //     isInCache = cache.some(
  //       (item) => item.name.toLowerCase() === name.toLowerCase() && item.categoryId !== idToExclude
  //     );

  //     if (isInCache) {
  //       this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã có rồi!`, '', 'error', 2000);
  //     }
  //   });

  //   return isInCache;
  // }

}