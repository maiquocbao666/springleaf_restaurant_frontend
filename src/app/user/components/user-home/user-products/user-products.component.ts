import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryService } from 'src/app/services/category.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserProductDetailComponent } from './user-product-detail/user-product-detail.component';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
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

  categoriesUrl = 'categories';
  productsUrl = 'products';

  constructor(
    private reservationService: ReservationService,
    private orderService: OrderService,
    private deliveryOrderService : DeliveryOrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
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
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  getCategoryById(id: number): Category | null {
    const found = this.categories.find(data => data.categoryId === id);
    return found || null;
  }

  getCategories(): void {
    // this.categoryService.gets();
    // this.categoryService.cache$
    //   .subscribe(categories => {
    //     this.categoryService.gets();
    //     this.categories = JSON.parse(localStorage.getItem(this.categoriesUrl) || 'null');
    //   });
  }

  getProductsByCategoryId(): void {
    this.products = JSON.parse(localStorage.getItem(this.productsUrl) || 'null');
    if (this.categoryId) {
      console.log(this.categoryId);
      this.products = this.products.filter(data => data.categoryId === this.categoryId);
      console.log(this.products);
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

  

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  // addOrder(): void {
  //   const orderDate = "2023-11-18";
  //   const userId = this.user?.userId;
  //   const staffId = userId;
  //   const comboId = 1;
  //   const status = false;
  //   const deliveryOrderId = null;
  //   const totalAmount = 50.0;


  //   this.reservationService.getReservationId().subscribe(reservationId => {
  //     if (!reservationId) {
  //       this.toastService.showWarn('Bạn chưa đặt bàn!!!');
  //       return; 
  //     }
  //     const newOrder: Order = {
  //       orderId: 0,
  //       combo: comboId!,
  //       reservationId: reservationId!,
  //       deliveryOrderId: deliveryOrderId!,
  //       orderDate: orderDate,
  //       totalAmount: totalAmount!,
  //       staffId: staffId!, // Sử dụng staffId lấy được từ user
  //       status: status
  //     };

  //     this.orderService.addOrder(newOrder).subscribe(
  //       {
  //         next: (addedOrder) => {
  //           alert("Thành công")
  //           this.toastService.showSuccess('Tạo order thành công!');
  //         },
  //         error: (error) => {
  //           console.error('Error adding order:', error);

  //         },
  //         complete: () => {

  //         }
  //       }
  //     );
  //   });
  // }

  openProductDetailModal(product: Product) {
    const modalRef = this.modalService.open(UserProductDetailComponent, { size: 'lg' });
    modalRef.componentInstance.product = product;

  }

}
