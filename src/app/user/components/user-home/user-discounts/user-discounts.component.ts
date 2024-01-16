import { Component } from "@angular/core";
import { DeliveryOrder } from "src/app/interfaces/delivery-order";
import { Discount } from "src/app/interfaces/discount";
import { Order } from "src/app/interfaces/order";
import { Product } from "src/app/interfaces/product";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartDetailService } from "src/app/services/cart-detail.service";
import { DeliveryOrderService } from "src/app/services/delivery-order.service";
import { DiscountService } from "src/app/services/discount.service";
import { OrderService } from "src/app/services/order.service";
import { ProductService } from "src/app/services/product.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
    selector: 'app-user-discounts',
    templateUrl: './user-discounts.component.html',
    styleUrls: ['./user-discounts.component.css']
})
export class UserDiscountsComponent {

    user: User | null = null;
    discounts: Discount[] = [];
    products: Product[] | null = null;
    productsForDiscount: Product[] | null = null;
    voucher: Discount[] = [];
    cartByUser: DeliveryOrder | null = null;
    orderByUser: Order | null = null;
    constructor(
        private discountsService: DiscountService,
        private authService: AuthenticationService,
        private orderDetailService: CartDetailService,
        private productService: ProductService,
        private toastService: ToastService,
        private orderService: OrderService,
        private deliveryOrderService: DeliveryOrderService,
    ) {
        this.authService.getUserCache().subscribe(
            (data) => {
                this.user = data;
            }
        );

        this.deliveryOrderService.userCart$.subscribe(cart => {
            this.cartByUser = cart;
        });
        this.orderService.userOrderCache$.subscribe(order => {
            this.orderByUser = order;
        });

        const productsString = localStorage.getItem('products');
        if (productsString) {
            const parsedProducts: Product[] = JSON.parse(productsString);
            this.products = parsedProducts;
        } else {
            console.error('No products found in local storage or the value is null.');
        }
    }

    ngOnInit(): void {
        this.getDiscounts();
    }

    getDiscounts(): void {
        this.discountsService.getCache().subscribe(
            (cached: Discount[]) => {
                this.discounts = cached.filter(discount => discount.userId === this.user?.restaurantBranchId);
                for (let discount of this.discounts) {
                    if (discount.userId === null) {
                        this.voucher.push(discount);
                    }
                    for (let product of this.products!) {
                        if (product.menuItemId === discount.userId) {
                            this.productsForDiscount?.push(product);
                        }

                    }
                }

            }
        );
    }

    getProducts(): void {

    }

    formatAmount(amount: number): string {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
    }
}  