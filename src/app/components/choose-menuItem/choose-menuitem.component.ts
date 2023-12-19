import { Component, Input } from "@angular/core";
import { Product } from "src/app/interfaces/product";
import { Reservation } from "src/app/interfaces/reservation";
import { User } from "src/app/interfaces/user";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ProductService } from "src/app/services/product.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import { ReservationService } from "src/app/services/reservation.service";

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