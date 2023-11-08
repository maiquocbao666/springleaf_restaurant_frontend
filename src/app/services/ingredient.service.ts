
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ingredient } from '../interfaces/ingredient';


@Injectable({
    providedIn: 'root'
})
export class IngredientService {

    private ingredientsUrl = 'ingredients';
    private ingredientUrl = 'ingredient';
    ingredientsCache!: Ingredient[];

    constructor(private apiService: ApiService) { }

    // Sử dụng ApiService để gửi yêu cầu GET
    getIngredients(): Observable<Ingredient[]> {

        if (this.ingredientsCache) {

            console.log("Có ingredients cache");
            return of(this.ingredientsCache);

        }

        const ingredientsObservable = this.apiService.request<Ingredient[]>('get', this.ingredientsUrl);

        ingredientsObservable.subscribe(data => {

            this.ingredientsCache = data;

        });

        return ingredientsObservable;

    }

    getIngredient(id: number): Observable<Ingredient> {

        if (!this.ingredientsCache) {

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

    addIngredient(newIngredient: Ingredient): Observable<Ingredient> {

        return this.apiService.request<Ingredient>('post', this.ingredientUrl, newIngredient).pipe(

            tap((addedIngredient: Ingredient) => {

                this.ingredientsCache.push(addedIngredient);
                localStorage.setItem(this.ingredientsUrl, JSON.stringify(this.ingredientsCache));

            })

        );

    }


    updateIngredient(updatedIngredient: Ingredient): Observable<any> {

        const url = `${this.ingredientUrl}/${updatedIngredient.ingredientId}`;

        return this.apiService.request('put', url, updatedIngredient).pipe(

            tap(() => {

                const index = this.ingredientsCache!.findIndex(ingregient => ingregient.ingredientId === updatedIngredient.ingredientId);

                if (index !== -1) {

                    this.ingredientsCache![index] = updatedIngredient;
                    localStorage.setItem(this.ingredientsUrl, JSON.stringify(this.ingredientsCache));

                }

            })

        );

    }

    updateIngredientCache(updatedIngredient: Ingredient): void {

        if (this.ingredientsCache) {

            const index = this.ingredientsCache.findIndex(cat => cat.ingredientId === updatedIngredient.ingredientId);

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