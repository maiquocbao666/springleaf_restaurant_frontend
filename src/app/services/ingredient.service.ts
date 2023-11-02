
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Ingredient } from '../interfaces/ingredient';


@Injectable({
    providedIn: 'root'
})
export class IngredientService {

    private ingredientsUrl = 'ingredients'; // URL to web api, không cần thêm base URL
    private ingredientUrl = 'ingredient';
    ingredientsCache!: Ingredient[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getIngredients(): Observable<Ingredient[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.ingredientsCache) {
            console.log("Có ingredients cache");
            return of(this.ingredientsCache);
        }

        const ingredientsObservable = this.apiService.request<Ingredient[]>('get', this.ingredientsUrl);

        // Cache the categories observable
        ingredientsObservable.subscribe(data => {
            this.ingredientsCache = data; // Store the fetched data in the cache
        });

        return ingredientsObservable;
    }

    // Lấy sản phẩm theo ID
    getIngredient(id: number): Observable<Ingredient> {
        // Check if categoriesCache is null or empty
        if (!this.ingredientsCache) {
            // Fetch the data from the API if cache is empty
           this.getIngredients();
        }

        // Try to find the Category in the cache by its id
        const ingredientFromCache = this.ingredientsCache.find(ingredient => ingredient.ingredientId === id);

        if (ingredientFromCache) {
            // If found in cache, return it as an observable
            return of(ingredientFromCache);
        } else {
            // If not found in cache, fetch it from the API
            const url = `${this.ingredientUrl}/${id}`;
            return this.apiService.request<Ingredient>('get', url);
        }
    }

    addIngredient(newIngredient: Ingredient): Observable<Ingredient> {
        return this.apiService.request<Ingredient>('post', this.ingredientUrl, newIngredient);
    }

    // Cập nhật 
    updateIngredient(updatedIngredient: Ingredient): Observable<any> {
        const url = `${this.ingredientUrl}/${updatedIngredient.ingredientId}`;
        return this.apiService.request('put', url, updatedIngredient).pipe(
            tap(() => {
                // Cập nhật danh sách cache sau khi cập nhật danh mục
                const index = this.ingredientsCache!.findIndex(cat => cat.ingredientId === updatedIngredient.ingredientId);
                if (index !== -1) {
                    this.ingredientsCache![index] = updatedIngredient;
                    localStorage.setItem('ingredients', JSON.stringify(this.ingredientsCache));
                }
            })
        );
    }
    updateIngredientCache(updatedIngredient: Ingredient): void {
        // Check if categoriesCache is null
        if (this.ingredientsCache) {
            const index = this.ingredientsCache.findIndex(cat => cat.ingredientId === updatedIngredient.ingredientId);
            if (index !== -1) {
                this.ingredientsCache[index] = updatedIngredient;
            }
        }
    }




    // Xoá sản phẩm
    deleteIngredient(id: number): Observable<any> {
        const url = `${this.ingredientUrl}/${id}`;
        return this.apiService.request('delete', url);
    }
}