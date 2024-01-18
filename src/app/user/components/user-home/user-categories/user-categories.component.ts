import { Component, HostListener } from '@angular/core';
import { Observable, Subject, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { ProductDiscount } from 'src/app/interfaces/product-discounts';
import { CategoryService } from 'src/app/services/category.service';
import { DiscountProductInfo2 } from '../user-products/user-products.component';
import { ProductDiscountService } from 'src/app/services/product-discount.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/order.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { LoginComponent } from 'src/app/components/login/login.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-categories',
  templateUrl: './user-categories.component.html',
  styleUrls: ['./user-categories.component.css']
})
export class UserCategoriesComponent {

  //categoriesCache$!: Observable<Category[]>;
  categories: Category[] = [];
  searchTerms = new Subject<string>();
  showMore: boolean = false;
  isMobile: boolean = false;

  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;

  user : User | null= null;
  products!: Product[];
  productDiscounts!: ProductDiscount[];
  productFinal! : DiscountProductInfo2[];

  categoriesUrl = 'categories';

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
    private favoriteService: FavoriteService,
    private productDiscountService: ProductDiscountService
    ) {
      this.authService.getUserCache().subscribe((data) => {
        this.user = data;
        
      });
  }

  chunkArray(array: any[], size: number): any[] {
    const chunkedArr = [];
    let index = 0;
    while (index < array.length) {
      chunkedArr.push(array.slice(index, size + index));
      index += size;
    }
    return chunkedArr;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Số 768 là ngưỡng tùy chỉnh cho kích thước điện thoại
  }

  ngOnInit(): void {
    console.log("Init User Categories Component");
    this.getCategories();
    this.checkScreenSize();
    this.getProductDiscount();
    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      console.log(this.productDiscounts);
      //console.log( parsedProducts);
      if(parsedProducts && this.productDiscounts){
        this.productFinal = [];
        for(let x of this.productDiscounts){
          for(let y of parsedProducts){
            if(x.menuItemId === y.menuItemId){
              const newPro : DiscountProductInfo2 = {
                productDiscountId : x.productDiscountId,
                menuItemId : y.menuItemId,
                categoryId : y.categoryId,
                description : y.description,
                imageUrl : y.imageUrl,
                productName : y.name,
                discountValue : x.discountValue,
                unitPrice : y.unitPrice,
                startDate : x.startDate,
                endDate : x.endDate,
                active : x.active,
                restaurantId : this.user?.restaurantBranchId!,
              }
              this.productFinal.push(newPro);
            }
          }
        }
        console.log(this.productFinal)
      }
    } else {
      console.error('No products found in local storage or the value is null.');
    }
  }

  getProductDiscount(): void {
    this.productDiscountService.getCache().subscribe(
      (cached: any[]) => {
        this.productDiscounts = cached.filter(productDiscount => productDiscount.restaurantId === this.user?.restaurantBranchId);
      }
    )
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  truncateString(str: string, maxLength: number): string {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + '...'; // Trả về chuỗi được giới hạn độ dài
    }
    return str; // Trả về chuỗi ban đầu nếu không vượt quá độ dài tối đa
  }

  addToCart(productId: number | undefined) {
    if (this.user) {
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
              this.orderDetailService.getUserOrderDetail(this.orderByUser?.orderId as number).subscribe();
              this.toastService.showTimedAlert('Thêm thành công', '', 'success', 2000);
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
    } else {
      this.toastService.showConfirmAlert('Vui lòng đăng nhập?', '', 'warning')
        .then((result) => {
          if (result.isConfirmed) {

            const modalRef = this.modalService.open(LoginComponent, { size: 'lg' });

          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
    }
  }

  search(event: any) {
    const keyword = event.target.value;
    if (keyword.trim() === '') {
      this.getCategories();
    } else {
      this.categoryService.searchByKeywords(keyword).subscribe(
        (data) => {
          this.categories = data.filter(data => data.active === true);
        }
      );
    }
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: Category[]) => {
        this.categories = cached.filter(category => category.active === true);
      }
    );
  }

  

}
