import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CategoryService } from 'src/app/services/category.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReservationService } from 'src/app/services/reservation.service';
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

  constructor(
    private reservationService: ReservationService,
    private orderService: OrderService,
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
    this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
        this.remainingProducts = this.products.length - this.visibleProductCount;
      });
  }

  getCategoryById(categoryId: number): Observable<Category | null> {
    return this.categoryService.getCategoryById(categoryId);
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
