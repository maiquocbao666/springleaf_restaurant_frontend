import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ingredient } from '../interfaces/ingredient';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})

export class IngredientService extends BaseService<Ingredient>  {

    apisUrl = 'ingredients';
    cacheKey = 'ingredients';
    apiUrl = 'ingredient';
  
  
  
    constructor(
      apiService: ApiService,
      rxStompService: RxStompService,
      sweetAlertService: ToastService
    ) {
      super(apiService, rxStompService, sweetAlertService);
    }
  
    override gets(): Observable<Ingredient[]> {
      return super.gets();
    }
  
    override getById(id: number): Observable<Ingredient | null> {
      return super.getById(id);
    }
  
    override add(newObject: Ingredient): Observable<Ingredient> {
      return super.add(newObject);
    }
  
    override update(updatedObject: Ingredient): Observable<Ingredient> {
      return super.update(updatedObject);
    }
  
    override delete(id : number): Observable<any> {
      return super.delete(id);
    }
  
    override searchByName(term: string): Observable<Ingredient[]> {
      return super.searchByName(term);
    }
  
    override getItemId(item: Ingredient): number {
      return item.ingredientId!;
    }
  
    override getItemName(item: Ingredient): string {
      return item.name;
    }
  
    override getObjectName(): string {
      return "Ingredient";
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