import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
declare var $: any;
@Component({
  selector: 'app-user-products',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.css']
})
export class UserProductsComponent implements OnInit {

  categories$!: Observable<Category[]>;
  products!: Product[];
  categories: Category[] = [];
  categoryId!: number; // Khởi tạo categoryId là undefined
  visibleProductCount: number = 12; // Số sản phẩm ban đầu hiển thị
  remainingProducts!: number;
  user: User | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    window.addEventListener('storage', (event) => {
      this.authService.cachedData$.subscribe((data) => {
        this.user = data;
        console.log(this.user);
        // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
      });
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.route.paramMap.subscribe(paramMap => {
      const categoryIdString = paramMap.get('id');
      if (categoryIdString) {
        this.categoryId = parseInt(categoryIdString, 10);
        this.getProductsByCategoryId();
      }
    });

  }

  filterProductsByCategoryId(categoryId: number): any[] {
    return this.products.filter(product => product.categoryId === categoryId);
  }
  showMore(): void {
    this.visibleProductCount += 10; // Tăng số sản phẩm hiển thị lên 10
  }

  showLess(): void {
    this.visibleProductCount -= 10; // Giảm số sản phẩm hiển thị đi 10
  }

  getVisibleProducts(): Product[] {
    return this.products ? this.products.slice(0, this.visibleProductCount) : [];
  }

  getProducts(): void {
    this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
        this.remainingProducts = this.products.length - this.visibleProductCount;
      });
  }

  getCategoryById(categoryId: number): Observable<Category> {
    return this.categoryService.getCategory(categoryId);
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  getProductsByCategoryId(): void {
    if (this.categoryId) {
      this.productService.getProductsByCategoryId(this.categoryId)
        .subscribe(products => {
          this.products = products;
        });
    }
  }

  addToCart(product: Product): void {
    if (product.menuItemId) {
      this.productService.addToCart(product.menuItemId).subscribe(
        response => {
          // Handle the successful response, if needed
        },
        error => {
          if (error.status === 401) {
            alert("Vui lòng đăng nhập");
          } else {
            // Handle other errors
          }
        }
      );
    } else {
      console.error("Product ID is undefined. Cannot add to cart.");
    }
  }



}
