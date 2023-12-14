import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserProductDetailComponent } from './user-product-detail/user-product-detail.component';
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
  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;

  categoriesUrl = 'categories';
  productsUrl = 'products';

  constructor(
    private orderService: OrderService,
    private deliveryOrderService: DeliveryOrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private orderDetailService: CartDetailService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
    });
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
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
    this.visibleProductCount += 12; // Tăng số sản phẩm hiển thị lên 10
  }

  showLess(): void {
    this.visibleProductCount -= 12; // Giảm số sản phẩm hiển thị đi 10
  }


  // Trong file của bạn có thể thêm một hàm để giới hạn độ dài của chuỗi
  truncateString(str: string, maxLength: number): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...'; // Trả về chuỗi được giới hạn độ dài
    }
    return str; // Trả về chuỗi ban đầu nếu không vượt quá độ dài tối đa
  }

  getVisibleProducts(): Product[] {
    return this.products ? this.products.slice(0, this.visibleProductCount) : [];
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached.filter(product => product.status === true);
      }
    );
  }

  getCategoryById(id: number): Category | null {
    const found = this.categories.find(data => data.categoryId === id);
    return found || null;
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      cached => {
        this.categories = this.categories;
      }
    )
  }

  getProductsByCategoryId(): void {
    this.products = JSON.parse(localStorage.getItem(this.productsUrl) || 'null');
    if (this.categoryId) {
      this.products = this.products.filter(data => data.categoryId === this.categoryId);
    }
  }

  addToCart(productId: number | undefined) {
    if (productId) {
      const deliveryOrderId = this.cartByUser?.deliveryOrderId as number;
      const orderId = this.orderByUser?.orderId as number;

      this.productService.addToCart(productId, deliveryOrderId, orderId).subscribe({
        next: (response) => {
          if (response.message === "User not found") {
            this.toastService.showTimedAlert('Sai user', '', 'error', 2000);
          }
          else if (response.message === "Type not found") {
            this.toastService.showTimedAlert('Không thể đặt hàng', '', 'error', 2000);
          }
          else if (response.message === "MenuItem in cart") {
            this.toastService.showTimedAlert('Sản phẩm đã có trong giỏ hàng', '', 'error', 2000);
          }
          else if (response.message === "Item in cart") {
            this.toastService.showTimedAlert('Sản phẩm đã có trong giỏ hàng', '', 'error', 2000);
          }
          else {
            this.orderDetailService.getUserOrderDetail(this.orderByUser?.orderId as number).subscribe();
            this.toastService.showTimedAlert('Thêm thành công', '', 'success', 2000);

          }
        },
        error: (error) => {
          this.toastService.showTimedAlert('Thêm thất bại', error, 'error', 2000);
        }
      });
    } else {
      console.error("Product ID is undefined. Cannot add to cart.");
    }
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  openProductDetailModal(product: Product) {
    const modalRef = this.modalService.open(UserProductDetailComponent, { size: 'lg' });
    modalRef.componentInstance.product = product;
  }

  search(event: any) {
    const keyword = event.target.value;
    if (keyword.trim() === '') {
      this.getProducts();
    } else {
      this.productService.searchByKeywords(keyword).subscribe(
        (data) => {
          this.products = data;
        }
      );
    }
  }

}
