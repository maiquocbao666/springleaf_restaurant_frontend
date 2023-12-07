import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
declare var $: any;
@Component({
  selector: 'app-user-product-detail',
  templateUrl: './user-product-detail.component.html',
  styleUrls: ['./user-product-detail.component.css']
})
export class UserProductDetailComponent {
  @Input() product: Product | undefined;
  @Output() productSaved: EventEmitter<void> = new EventEmitter<void>();
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  fieldNames: string[] = [];
  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;

  constructor(
    private orderService: OrderService,
    private deliveryOrderService : DeliveryOrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderDetailService : CartDetailService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
  ) {
    
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    this.productForm = this.formBuilder.group({
      menuItemId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      status: [, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.setValue();
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }
  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getCategoryById(id: number): Category | null {
    const found = this.categories.find(data => data.categoryId === id);
    return found || null;
  }
  setValue() {
    if (this.product) {
      this.productForm.patchValue({
        menuItemId: this.product.menuItemId,
        name: this.product.name,
        unitPrice: this.product.unitPrice,
        description: this.product.description,
        status: this.product.status,
        categoryId: this.product.categoryId,
        imageUrl: this.product.imageUrl
      });

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
          else if(response.message === "Item in cart") {
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
}
