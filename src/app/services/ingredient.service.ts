import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ingredient } from '../interfaces/ingredient';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class IngredientService {

    private ingredientsUrl = 'ingredients';
    private ingredientUrl = 'ingredient';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private ingredientsCacheSubject = new BehaviorSubject<Ingredient[]>([]);
    ingredientsCache$ = this.ingredientsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get ingredientsCache(): Ingredient[] {
        return this.ingredientsCacheSubject.value;
    }

    set ingredientsCache(value: Ingredient[]) {
        this.ingredientsCacheSubject.next(value);
    }

    getIngredients(): Observable<Ingredient[]> {

        if (this.ingredientsCache.length > 0) {
            return of(this.ingredientsCache);
        }

        const ingredientsObservable = this.apiService.request<Ingredient[]>('get', this.ingredientsUrl);

        ingredientsObservable.subscribe(data => {
            this.ingredientsCache = data;
        });

        return ingredientsObservable;

    }

    getIngredientById(id: number): Observable<Ingredient> {

        if (this.ingredientsCache.length === 0) {
            this.getIngredients();
        }

        const ingredientFromCache = this.ingredientsCache.find(ingredient => ingredient.ingredientId === id);

        if (ingredientFromCache) {
            return of(ingredientFromCache);
        } else {
            const url = `${this.ingredientUrl}/${id}`;
            return this.apiService.request<Ingredient>('get', url);
        }
    }

    private isIngredientNameInCache(name: string): boolean {
        const isTrue = !!this.ingredientsCache?.find(ingredient => ingredient.name.toLowerCase() === name.toLowerCase());
        if(isTrue){
            console.log("Thành phần này đã có trong mục yêu thích rồi");
            return isTrue;
        } else {
            return isTrue;
        }
    }

    addIngredient(newIngredient: Ingredient): Observable<Ingredient> {
        if (this.isIngredientNameInCache(newIngredient.name)) {
            // Nếu đã có ingredient có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        return this.apiService.request<Ingredient>('post', this.ingredientUrl, newIngredient).pipe(
            tap((addedIngredient: Ingredient) => {
                this.ingredientsCache = [...this.ingredientsCache, addedIngredient];
                localStorage.setItem(this.ingredientsUrl, JSON.stringify(this.ingredientsCache));
            })
        );
    }

    updateIngredient(updatedIngredient: Ingredient): Observable<any> {
        if (this.isIngredientNameInCache(updatedIngredient.name)) {
            // Nếu đã có ingredient có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        const url = `${this.ingredientUrl}/${updatedIngredient.ingredientId}`;

        return this.apiService.request('put', url, updatedIngredient).pipe(
            tap(() => {
                const index = this.ingredientsCache!.findIndex(ingredient => ingredient.ingredientId === updatedIngredient.ingredientId);
                if (index !== -1) {
                    this.ingredientsCache![index] = updatedIngredient;
                    localStorage.setItem(this.ingredientsUrl, JSON.stringify(this.ingredientsCache));
                }
            })
        );
    }

    updateIngredientCache(updatedIngredient: Ingredient): void {
        if (this.ingredientsCache) {
            const index = this.ingredientsCache.findIndex(ingredient => ingredient.ingredientId === updatedIngredient.ingredientId);
            if (index !== -1) {
                this.ingredientsCache[index] = updatedIngredient;
            }
        }
    }

    deleteIngredient(id: number): Observable<any> {
        const url = `${this.ingredientUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const index = this.ingredientsCache.findIndex(ingredient => ingredient.ingredientId === id);
                if (index !== -1) {
                    this.ingredientsCache.splice(index, 1);
                    localStorage.setItem(this.ingredientsUrl, JSON.stringify(this.ingredientsCache));
                }
            })
        );
    }
}