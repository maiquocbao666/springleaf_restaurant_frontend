import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';
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

  //@Input() userId!: number;
  thisUserReservations!: Reservation[];
  products: Product[] = [];
  selections: { [key: string]: boolean } = {};
  selectedItems: any[] = [];
  selectReservation: number | null = null;
  user: User | null = null;

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
  }

  showProductInfomation() {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  getClassForStatus(status: string): string {
    if (status === 'Đang đợi') {
      return 'badge badge-warning';
    } else if (status === 'Đang sử dụng') {
      return 'badge badge-success';
    } else if (status === 'Đã sử dụng xong') {
      return 'badge badge-danger';
    }
    return ''; // Hoặc class mặc định khác nếu cần
  }


  toggleSelection(product: any): void {
    const index = this.selectedItems.indexOf(product);
    if (index === -1) {
      this.selectedItems.push(product);
      console.log("Thêm item: " + product.menuItem)
    } else {
      console.log("Xóa item: " + product.menuItem)
      this.selectedItems.splice(index, 1);
    }
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
      this.setSelectReservation(reservationId);
      this.showProductInfomation();
    }
  }

  setSelectReservation(reservationId: number) {
    this.selectReservation = reservationId;
    console.log(this.selectReservation)
  }

  orderReservation() {
    this.selectedItems;
    if (this.selectedItems.length <= 0) {
      this.toastService.showTimedAlert('Vui lòng chọn sản phẩm', '', 'error', 2000);
    } else {
      this.reservationService.order(this.selectedItems, this.selectReservation as number)?.subscribe({
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