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
import { CartDetail } from "src/app/interfaces/cart-detail";

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
  menuItemList: MenuItemSelected[] = [];
  selections: { [key: string]: boolean } = {};
  selectedItem: CartDetail[] = [];

  quantities: { [key: number]: number } = {};
  constructor(
    private authService: AuthenticationService,
    private productService: ProductService,
    public activeModal: NgbActiveModal,
    private sweetAlertService: ToastService,
    private modalService: NgbModal,
    private reservationService: ReservationService,
    private vnpayService: VNPayService,
    private orderService: OrderService,
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
    this.payWithVNPay();
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const cart of this.selectedItems) {
      totalPrice += cart.unitPrice * cart.quantity;
    }
    return totalPrice;
  }

  payWithVNPay(): void {
    var orderTotal = 0;
    var orderDetails : CartDetail[] = []
    // Kiểm tra nếu selectedItems là mảng rỗng
    if (this.selectedItems.length === 0) {
      orderTotal = 200000;
      this.reservationOfUser.reservationDeposit += 200000;
    } else {
      orderTotal = 50000;

      for (const item of this.selectedItems) {
        for (const product of this.products) {
          // Kiểm tra item.menuItem và this.quantities[product.menuItemId] có giá trị và kiểu dữ liệu đúng không
          if (item.menuItemId === product.menuItemId && this.quantities.hasOwnProperty(product.menuItemId) ) {
            orderTotal += this.quantities[product.menuItemId] * product.unitPrice;
            var orderDetail: CartDetail = {
              menuItemId : product.menuItemId,
              quantity : this.quantities[product.menuItemId],
              orderId: 1,
              orderDetailId : 1
            }
            orderDetails.push(orderDetail);
          }
        }
      }

      this.reservationOfUser.reservationDeposit = orderTotal;
    }

    // Lưu vào localStorage
    localStorage.setItem('new_reservation_orderItem', JSON.stringify(this.reservationOfUser));
    localStorage.setItem('new_orderDetail_by_reservation', JSON.stringify(orderDetails));

    var orderInfo = 'ReservationPaymentReservationOrderItem'

    this.vnpayService.submitOrder(orderTotal, orderInfo).subscribe({
      next: (data: any) => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // Xử lý các trường hợp khác nếu cần
        }
      },
      error: (error: any) => {
        console.error('Failed to submit order. Please try again.', error);
      }
    });
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
  menuItemId: number;
  quantity: number;
  menuItemName: string;
  unitPrice: number;
  menuItemImage: string;
}