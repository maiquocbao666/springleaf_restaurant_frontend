import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ingredient } from '../interfaces/ingredient';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})

export class IngredientService extends BaseService<Ingredient>  {

  //------------------------------------------------------------------------------------------------------

  apisUrl = 'ingredients';
  cacheKey = 'ingredients';
  apiUrl = 'ingredient';

  //------------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //------------------------------------------------------------------------------------------------------

  override getItemId(item: Ingredient): number {
    return item.ingredientId!;
  }

  override getItemName(item: Ingredient): string {
    return item.name;
  }

  override getObjectName(): string {
    return "Ingredient";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //------------------------------------------------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  override add(newObject: Ingredient): Observable<Ingredient> {
    return super.add(newObject);
  }

  override update(updatedObject: Ingredient): Observable<Ingredient> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  //--------------------------------------------------------------------------------------------------------------------------

  checkThreshold(): Observable<any> {
    const checkThresholdUrl = 'checkThreshold';
    return this.apiService.request<any>('get', checkThresholdUrl);
  }

  // private isIngredientNameInCache(name: string): boolean {
  //   const isTrue = !!this.ingredientsCache?.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase());
  //   if (isTrue) {
  //     console.log("Thành phần này đã có trong mục yêu thích rồi");
  //     return isTrue;
  //   } else {
  //     return isTrue;
  //   }
  // }

}