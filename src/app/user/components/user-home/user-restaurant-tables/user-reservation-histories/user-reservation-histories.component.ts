import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { Product } from 'src/app/interfaces/product';
import { Reservation } from 'src/app/interfaces/reservation';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-reservation-histories',
  templateUrl: './user-reservation-histories.component.html',
  styleUrls: ['./user-reservation-histories.component.css']
})
export class UserReservationHistoriesComponent {

  thisUserReservations!: Reservation[];
  products: any[] = [];
  selections: { [key: string]: boolean } = {};
  selectedItems: Product[] = [];
  cartDetails: CartDetail[] = [];
  selectReservation: number | null = null;
  user: User | null = null;
  selectedUserReservation: any;
  show: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private productService: ProductService,
    private toastService: ToastService,
    public activeModal: NgbActiveModal,
    private restaurantTableService: RestaurantTableService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.getUserCache().subscribe(
      (cached: any | null) => {
        this.user = cached;
      }
    );
  }

  ngOnInit(): void {
    this.reservationService.getReservationsByUserId(this.user?.userId!).subscribe(
      cached => {
        this.thisUserReservations = cached;
      }
    )

    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
    console.log('product' + this.products[0].menuItemId)
  }

  getClassForStatus(status: string): string {
    if (status === 'Chưa tới') {
      return 'badge badge-info'; // or any other color you prefer for this status
    } else if (status === 'Đang đợi') {
      return 'badge badge-warning';
    } else if (status === 'Đang sử dụng') {
      return 'badge badge-success';
    } else if (status === 'Hết thời gian đợi') {
      return 'badge badge-danger';
    } else if (status === 'Đã sử dụng xong') {
      return 'badge badge-secondary'; // or any other color you prefer for this status
    }
    return ''; // Default class or no class if status is not recognized
  }


  toggleSelection(product: Product): void {
    if (this.show) {
      const index = this.selectedItems.findIndex(item => item.menuItemId === product.menuItemId);

      let cartDetail: CartDetail = {
        orderDetailId: 1,
        orderId: 1,
        menuItemId: product.menuItemId as number,
        quantity: 1
      }
      if (index === -1) {
        this.selectedItems.push(product);
        this.cartDetails.push(cartDetail);
        console.log("Thêm item: " + product.menuItemId)
      } else {
        this.cartDetails.splice(index, 1);
        console.log("Xóa item: " + product.menuItemId)
        this.selectedItems.splice(index, 1);
      }
      console.log(this.selectedItems);
    } else {
      this.toastService.showTimedAlert('Vui lòng chọn 1 bàn', '', 'error', 1500);
    }
  }

  updateQuantity(event: Event, product: Product): void {
    const target = event.target as HTMLInputElement;
    console.log(target.value)
    if (target && target.value !== null) {
      const inputValue = target.value;
      const index = this.cartDetails.findIndex(item => item.menuItemId === product.menuItemId);
      if (index !== -1) {
        this.cartDetails[index].quantity = Number(inputValue);
        console.log("Cập nhật số lượng: " + this.cartDetails[index].quantity )
      }
    }
    
    console.log(this.cartDetails);
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const product of this.selectedItems) {
      totalPrice += product.unitPrice; // * cart.quantity;
    }

    return totalPrice;
  }

  calculateFinalPrice(discount: number): number {
    const totalPrice = this.calculateTotalPrice();
    const finalPrice = totalPrice - discount;

    return finalPrice >= 0 ? finalPrice : 0;
  }

  handleButtonClick(reservationId: number | undefined) {
    if (reservationId != null) {
      if (!this.selectReservation) {
        this.selectReservation = reservationId;
        this.show = true;
      } else {
        this.selectReservation = null;
        this.show = false;
      }
      console.log(this.selectReservation)

    }
  }


  orderReservation() {
    if (this.selectedItems.length <= 0) {
      this.toastService.showTimedAlert('Vui lòng chọn sản phẩm', '', 'error', 2000);
    } else {
      this.reservationService.order(this.selectedItems,this.cartDetails, this.selectReservation as number)?.subscribe({
        next: (response) => {
          if (response.message === 'Item was order') {
            this.toastService.showTimedAlert('Thêm thất bại', 'Bạn đã order món này rồi', 'error', 2000);
            this.products = [];
          } else {
            this.toastService.showTimedAlert('Thêm thành công', '', 'success', 2000);
            this.products = [];
          }

        },
        error: (error) => {
          this.toastService.showTimedAlert('Thêm thất bại', error, 'error', 2000);
        }
      });
    }
  }

  findTableNameByTableId(tableId: number): string {
    return this.restaurantTableService.findTableNameByTableId(tableId);
  }

  getUserNameById(id: number): string | undefined {
    return this.userService.getUserNameById(id);
  }

}
export interface OrderReservationInfomation {
  orderDetailId?: number;
  order: number;
  menuItem: number;
  quantity: number;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImage: string;
  menuItemQuantity: number
}