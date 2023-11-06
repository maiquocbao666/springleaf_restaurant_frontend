import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesUrl = 'categories';
  categoriesCache!: Category[];
  private categoryUrl = 'category';

  constructor(private apiService: ApiService) { }


  getCategories(): Observable<Category[]> {

    if (this.categoriesCache) {

      return of(this.categoriesCache);

    }

    const categoriesObservable = this.apiService.request<Category[]>('get', this.categoriesUrl);

    categoriesObservable.subscribe(data => {

      this.categoriesCache = data;

    });

    return categoriesObservable;

  }

  getCategory(id: number): Observable<Category> {

    if (!this.categoriesCache) {

      this.getCategories();

    }

    const categoryFromCache = this.categoriesCache.find(category => category.categoryId === id);

    if (categoryFromCache) {

      return of(categoryFromCache);

    } else {

      const url = `${this.categoryUrl}/${id}`;
      return this.apiService.request<Category>('get', url);

    }

  }


  addCategory(newCategory: Category): Observable<Category> {

    return this.apiService.request<Category>('post', this.categoryUrl, newCategory).pipe(

      tap((addedCategory: Category) => {

        this.categoriesCache.push(addedCategory);
        localStorage.setItem("categories", JSON.stringify(this.categoriesCache));

      })

    );

  }


  updateCategory(updatedCategory: Category): Observable<any> {

    const url = `${this.categoryUrl}/${updatedCategory.categoryId}`;

    return this.apiService.request('put', url, updatedCategory).pipe(

      tap(() => {

        const index = this.categoriesCache!.findIndex(category => category.categoryId === updatedCategory.categoryId);

        if (index !== -1) {

          this.categoriesCache![index] = updatedCategory;
          localStorage.setItem(this.categoriesUrl, JSON.stringify(this.categoriesCache));

        }

      })

    );

  }

  deleteCategory(id: number): Observable<any> {

    const url = `${this.categoryUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(

      tap(() => {

        const index = this.categoriesCache.findIndex(cat => cat.categoryId === id);

        if (index !== -1) {

          this.categoriesCache.splice(index, 1);
          localStorage.setItem('categories', JSON.stringify(this.categoriesCache));

        }

      })
    );

  }

  searchCategoriesByName(term: string): Observable<Category[]> {

    if (!term.trim()) {

      return of([]);

    }

    if (this.categoriesCache) {

      const filteredCategories = this.categoriesCache.filter(category => {
        return category.name.toLowerCase().includes(term.toLowerCase());
      });

      if (filteredCategories.length > 0) {
        return of(filteredCategories);
      }

    }

    return this.apiService.request("get", this.categoriesUrl).pipe(

      map(response => response as Category[]),
      catchError(error => {

        console.error(error);
        return of([]);

      })
    );

  }

  updateCategoryCache(updatedCategory: Category): void {

    if (this.categoriesCache) {

      const index = this.categoriesCache.findIndex(cat => cat.categoryId === updatedCategory.categoryId);

      if (index !== -1) {

        this.categoriesCache[index] = updatedCategory;

      }
    }

  }

}