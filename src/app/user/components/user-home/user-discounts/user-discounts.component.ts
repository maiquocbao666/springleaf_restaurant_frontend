import { Component } from "@angular/core";
import { DeliveryOrder } from "src/app/interfaces/delivery-order";
import { Discount } from "src/app/interfaces/discount";
import { Order } from "src/app/interfaces/order";
import { Product } from "src/app/interfaces/product";
import { ProductDiscount } from "src/app/interfaces/product-discounts";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartDetailService } from "src/app/services/cart-detail.service";
import { DeliveryOrderService } from "src/app/services/delivery-order.service";
import { DiscountService } from "src/app/services/discount.service";
import { OrderService } from "src/app/services/order.service";
import { ProductDiscountService } from "src/app/services/product-discount.service";
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

    productDiscounts: ProductDiscount[] = [];
    discountInfo : DiscountProductInfo[] = [];
    constructor(
        private discountsService: DiscountService,
        private authService: AuthenticationService,
        private orderDetailService: CartDetailService,
        private productService: ProductService,
        private toastService: ToastService,
        private orderService: OrderService,
        private deliveryOrderService: DeliveryOrderService,
        private productDiscountService: ProductDiscountService,
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
        this.getProducts();
        this.getDiscounts();
        this.getProductDiscounts();
    }

    getDiscounts(): void {
        this.discountsService.getCache().subscribe(
            (cached: Discount[]) => {
                this.discounts = cached.filter(discount => discount.userId === null);
                for (let discount of this.discounts) {
                    if (discount.userId === null) {
                        this.voucher.push(discount);
                    }
                }

            }
        );
    }

    getProductDiscounts(): void {
        this.discountInfo = [];
        this.productDiscountService.getCache().subscribe(
            (cached: ProductDiscount[]) => {
                this.productDiscounts = cached.filter(discount => discount.restaurantId === this.user?.restaurantBranchId);
                console.log("here" + (this.productDiscounts.length));
                for(let discount of this.productDiscounts){
                    for(let product of this.products!){
                        if(discount.productDiscountId === product.menuItemId){
                            let newDiscount : DiscountProductInfo = {
                                productDiscountId : discount.productDiscountId,
                                discountValue : discount.discountValue,
                                restaurantId : discount.restaurantId,
                                menuItemId : product.menuItemId!,
                                startDate : discount.startDate,
                                endDate : discount.endDate,
                                productName : product.name,
                                imageUrl : product.imageUrl,
                                unitPrice : product.unitPrice,
                                active : discount.active
                            }
                            this.discountInfo.push(newDiscount);
                        }
                    }
                }
                

            }
        );
    }

    getProducts(): void {
        this.productService.getCache().subscribe(
            (cached: Product[]) => {
                this.products = cached;
        })
    }

    formatAmount(amount: number): string {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    formatDate(dateString: string): string {
        // Tách ngày, tháng và năm từ chuỗi
        const parts = dateString.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
      
        // Định dạng lại chuỗi thành "dd-mm-yyyy"
        const formattedDate = `${day}-${month}-${year}`;
      
        return formattedDate;
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

    addDiscount(discountId : number | undefined){
        for(let discount of this.discounts){
            if(discount.discountId === discountId){
                const newDiscount : Discount = {
                    discountCode : discount.discountCode,
                    discountValue : discount.discountValue,
                    endDate : discount.endDate,
                    startDate : discount.startDate,
                    userId : this.user?.userId!,
                    limitValue : discount.discountValue,
                    active : discount.active,
                    discountId : discount.discountId
                }
                this.discountsService.add(newDiscount).subscribe({
                    next: (response) => {
                        if (response) {
                            this.toastService.showTimedAlert('Thêm thành công', '', 'success', 2000);
                            this.getDiscounts();
                        }
                        
                    },
                    error: (error) => {
                        this.toastService.showTimedAlert('Thêm thất bại', error, 'error', 2000);
                    }
                });
            }
        }
    }
}  

export interface DiscountProductInfo{
    productDiscountId?  : number;
    menuItemId : number;
    restaurantId : number;
    discountValue : number;
    startDate : string;
    endDate : string ;
    active : boolean ;
    productName : string;
    imageUrl : string;
    unitPrice : number;
}