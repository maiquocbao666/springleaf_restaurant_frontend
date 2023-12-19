import { Component, Input } from "@angular/core";
import { Product } from "src/app/interfaces/product";
import { Reservation } from "src/app/interfaces/reservation";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ProductService } from "src/app/services/product.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { ReservationService } from "src/app/services/reservation.service";
import { VNPayService } from "src/app/services/VNpay.service";
import { OrderService } from "src/app/services/order.service";

@Component({
  selector: 'app-choosemenuitem',
  templateUrl: './choose-menuitem.component.html',
  styleUrls: ['./choose-menuitem.component.css']
})
export class ChooseMenuItemComponent {
  @Input() reservationOfUser!: Reservation;
  user: User | null = null;
  products: Product[] = [];
  selectedItems: MenuItemSelected[] = [];
  cartInformationArray: CartInfomation[] = [];
  menuItemList : MenuItemSelected[] = [];
  selections: { [key: string]: boolean } = {};

  quantities: { [key: number]: number } = {};
  constructor(
    private authService: AuthenticationService,
    private productService: ProductService,
    public activeModal: NgbActiveModal,
    private sweetAlertService: ToastService,
    private modalService: NgbModal,
    private reservationService: ReservationService,
    private vnpayService : VNPayService,
    private orderService : OrderService,
  ) {
    const productsString = localStorage.getItem('products');
    if (productsString) {
      const parsedProducts: Product[] = JSON.parse(productsString);
      this.products = parsedProducts;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
  }

  ngOninit() {
    console.log(this.products);
    this.authService.getUserCache().subscribe(
      (data) => {
        this.user = data;
      }
    );

    this.orderService.gets();
    
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  validateQuantity(event: Event, cart: any): void {
    const inputElement = event.target as HTMLInputElement;
    const newValue = parseInt(inputElement.value, 10);
    const limitProduct = 100; // Thay đổi lại sau khi xử lý ở backend lấy giá trị cho biến này
    if (isNaN(newValue) || newValue < 1 || newValue > limitProduct) {
      inputElement.value = cart.quantity.toString();
    } else {
      cart.quantity = newValue;
      // const cartDetail: CartDetail = {
      //   orderDetailId: cart.orderDetailId,
      //   orderId: cart.order,
      //   menuItemId: cart.menuItem,
      //   quantity: newValue
      // };
      // this.cartDetailService.update(cartDetail).subscribe();
      // this.cartDetailService.getUserOrderDetail(cart.order).subscribe();
    }
  }

  updateQuantity(product: any, event: any): void {
    this.quantities[product.menuItemId] = event.target.value;
    console.log(this.quantities);
  }

  toggleSelection(cart: any): void {
    const index = this.selectedItems.indexOf(cart);

    if (index === -1) {
      this.selectedItems.push(cart);
      console.log(this.selectedItems);
    } else {
      this.selectedItems.splice(index, 1);
    }

    const anyUnchecked = this.cartInformationArray.some(cart => !this.selections[cart.menuItem]);

  }

  // Đặt bàn 
  // this.reservationService.add(newReservation).subscribe(
  //   {
  //     next: (addedReservation) => {
  //       this.sweetAlertService.showTimedAlert('Chúc mừng!', 'Bạn đã đặt bàn thành công', 'success', 3000);
  //       reservationsCache.push(addedReservation);
  //       localStorage.setItem('reservations', JSON.stringify(reservationsCache));
  //     },
  //     error: (error) => {
  //       console.error('Error adding reservation:', error);
  //     },
  //     complete: () => {
  //       // Xử lý khi Observable hoàn thành (nếu cần)
  //     }
  //   }
  // );

  checkout() {

  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const cart of this.selectedItems) {
      totalPrice += cart.menuItemPrice * cart.quantity;
    }
    return totalPrice;
  }

  // payWithVNPay(): void {
  //   var orderTotal = 200; 
  //   this.orderInfo = this.orderByUser?.orderId?.toString() +"," || ""; // dữ liệu order detail
    
    
  //   this.orderInfo = this.orderInfo.replace(/,$/, "");
  //   if (this.orderTotal && this.orderInfo) {
  //     this.vnpayService.submitOrder(orderTotal, this.orderInfo).subscribe({
  //       next: (data: any) => {
  //         if (data.redirectUrl) {
  //           window.location.href = data.redirectUrl; // Chuyển hướng đến URL được trả về từ backend
  //           this.onGetPaymentStatus();
  //         } else {
  //           // Xử lý các trường hợp khác nếu cần
  //         }
  //       },
  //       error: (error: any) => {
  //         console.error('Failed to submit order. Please try again.', error);
  //       }
  //     });
  //     console.log('Thanh toán bằng VNPAY');
  //   }
  // }

  // onGetPaymentStatus(): void {
  //   this.vnpayService.getPaymentStatus().subscribe(
  //     (data: any) => {
  //       if (data.paymentStatus === 1) {
  //         this.paymentStatus = 'Order success';
  //         // Hiển thị thông tin thanh toán nếu cần
  //         console.log('Order Info:', data.orderInfo);
  //         console.log('Payment Time:', data.paymentTime);
  //         console.log('Transaction ID:', data.transactionId);
  //         console.log('Total Price:', data.totalPrice);
  //       } else {
  //         this.paymentStatus = 'Order failed';
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Failed to get payment status. Please try again.', error);
  //     }
  //   );
  // }


}

export interface CartInfomation {
  orderDetailId?: number;
  order: number;
  menuItem: number;
  quantity: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
  menuItemQuantity: number
}

export interface MenuItemSelected {
  menuItem: number;
  quantity: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
}