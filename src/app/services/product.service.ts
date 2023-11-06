import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Product } from '../interfaces/product';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'products';
  private categoryUrl = 'category';
  private productUrl = 'product';
  productsCache!: Product[];

  constructor(private apiService: ApiService) { }

  getProducts(): Observable<Product[]> {

    if (this.productsCache) {
      return of(this.productsCache);
    }

    const productsObservable = this.apiService.request<Product[]>('get', this.productsUrl);

    productsObservable.subscribe(data => {

      this.productsCache = data;

    });

    return productsObservable;

  }

  getProduct(id: number): Observable<Product> {

    if (!this.productsCache) {

      this.getProducts();

    }


    const productFromCache = this.productsCache.find(Product => Product.menuItemId === id);

    if (productFromCache) {

      return of(productFromCache);

    } else {

      const url = `${this.productsUrl}/${id}`;
      return this.apiService.request<Product>('get', url);

    }

  }


  getProductsByCategoryId(categoryId: number): Observable<Product[]> {

    if (this.productsCache) {

      const products = this.productsCache.filter(product => product.categoryId === categoryId);

      return of(products);

    }

    const url = `${this.categoryUrl}/${categoryId}/products`;

    return this.apiService.request<Product[]>('get', url);

  }

  addProduct(newProduct: Product): Observable<Product> {

    return this.apiService.request<Product>('post', this.productsUrl, newProduct).pipe(

      tap((addedProduct: Product) => {

        this.productsCache.push(addedProduct);
        localStorage.setItem(this.productsUrl, JSON.stringify(this.productsCache));

      })

    );

  }


  updateProduct(updatedProduct: Product): Observable<any> {

    const url = `${this.productUrl}/${updatedProduct.menuItemId}`;

    return this.apiService.request('put', url, updatedProduct).pipe(

      tap(() => {

        const index = this.productsCache!.findIndex(products => products.menuItemId === updatedProduct.menuItemId);

        if (index !== -1) {

          this.productsCache![index] = updatedProduct;
          localStorage.setItem('products', JSON.stringify(this.productsCache));

        }

      })

    );

  }

  updateProductCache(updatedProduct: Product): void {

    if (this.productsCache) {

      const index = this.productsCache.findIndex(cat => cat.menuItemId === updatedProduct.menuItemId);

      if (index !== -1) {

        this.productsCache[index] = updatedProduct;

      }
    }

  }

  deleteProduct(id: number): Observable<any> {

    const url = `${this.productUrl}/${id}`;

    return this.apiService.request('delete', url);

  }

}
