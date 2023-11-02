import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesUrl = 'categories'; // URL to web api, không cần thêm base URL
  categoriesCache!: Category[]; // Cache for categories
  private categoryUrl = 'category';

  constructor(private apiService: ApiService) { } // Inject ApiService

  // Sử dụng ApiService để gửi yêu cầu GET
  getCategories(): Observable<Category[]> {
    // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }

    const categoriesObservable = this.apiService.request<Category[]>('get', this.categoriesUrl);

    // Cache the categories observable
    categoriesObservable.subscribe(data => {
      this.categoriesCache = data; // Store the fetched data in the cache
    });

    return categoriesObservable;
  }

  // Lấy sản phẩm theo ID
  getCategory(id: number): Observable<Category> {
    // Check if categoriesCache is null or empty
    if (!this.categoriesCache) {
      // Fetch the data from the API if cache is empty
      this.getCategories();
    }

    // Try to find the Category in the cache by its id
    const categoryFromCache = this.categoriesCache.find(category => category.categoryId === id);

    if (categoryFromCache) {
      // If found in cache, return it as an observable
      return of(categoryFromCache);
    } else {
      // If not found in cache, fetch it from the API
      const url = `${this.categoryUrl}/${id}`;
      return this.apiService.request<Category>('get', url);
    }
  }

  // Thêm sản phẩm mới
  addCategory(newCategory: Category): Observable<Category> {
    return this.apiService.request<Category>('post', this.categoryUrl, newCategory).pipe(
      tap((addedCategory: Category) => {
        // Assuming categoriesCache is an array where you store your categories
        this.categoriesCache.push(addedCategory); // Add the new category to the cache

        // Store the updated categoriesCache in local storage
        localStorage.setItem("categories", JSON.stringify(this.categoriesCache));
      })
    );
  }

  // Cập nhật sản phẩm
  updateCategory(updatedCategory: Category): Observable<any> {
    const url = `${this.categoryUrl}/${updatedCategory.categoryId}`;
    return this.apiService.request('put', url, updatedCategory).pipe(
      tap(() => {
        // Cập nhật danh sách cache sau khi cập nhật danh mục
        const index = this.categoriesCache!.findIndex(cat => cat.categoryId === updatedCategory.categoryId);
        if (index !== -1) {
          this.categoriesCache![index] = updatedCategory;
          localStorage.setItem('categories', JSON.stringify(this.categoriesCache));
        }
      })
    );
  }

  // Xoá sản phẩm
  deleteCategory(id: number): Observable<any> {
    const url = `${this.categoryUrl}/${id}`;
    return this.apiService.request('delete', url).pipe(
      tap(() => {
        // Xóa sản phẩm khỏi danh sách cache sau khi xóa sản phẩm
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
      // if not search term, return empty hero array.
      return of([]);
    }

    // Kiểm tra xem có dữ liệu caching không
    if (this.categoriesCache) {
      const filteredHeroes = this.categoriesCache.filter(category => {
        // Thực hiện tìm kiếm tương đối trong caching
        return category.name.toLowerCase().includes(term.toLowerCase());
      });

      if (filteredHeroes.length > 0) {
        // Trả về kết quả tìm kiếm từ caching nếu có
        return of(filteredHeroes);
      }
    }

    // Nếu không tìm thấy kết quả trong caching, thực hiện yêu cầu tìm kiếm mới từ máy chủ
    return this.apiService.request("get", this.categoriesUrl).pipe(
      map(response => response as Category[]),
      catchError(error => {
        console.error(error); // Log lỗi nếu cần thiết
        return of([]); // Trả về mảng rỗng nếu có lỗi trong quá trình tìm kiếm
      })
    );
  }



  updateCategoryCache(updatedCategory: Category): void {
    // Check if categoriesCache is null
    if (this.categoriesCache) {
      const index = this.categoriesCache.findIndex(cat => cat.categoryId === updatedCategory.categoryId);
      if (index !== -1) {
        this.categoriesCache[index] = updatedCategory;
      }
    }
  }

}