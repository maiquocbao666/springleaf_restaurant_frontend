import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { User } from 'src/app/interfaces/user';
import { VNPayService } from 'src/app/services/VNpay.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { EditSeatingComponent } from './edit-seating/edit-seating.component';
import { ChooseMenuItemComponent } from 'src/app/components/choose-menuItem/choose-menuitem.component';

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
  paymentStatus: string | undefined;

  restaurantTables: RestaurantTable[] = [];
  reservations: Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private productService: ProductService,
    private toastService: ToastService,
    public activeModal: NgbActiveModal,
    private restaurantTableService: RestaurantTableService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private vnpayService: VNPayService,
    private modalService: NgbModal,
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

    this.getRestaurantTables();

    console.log('product' + this.products[0].menuItemId)
  }

  editSeatingCapacity(tableId: number, reservationId: number) {
    //alert(reservationId);
    const modalRef = this.modalService.open(EditSeatingComponent, { size: 'lg' });
    modalRef.componentInstance.reservationId = reservationId;
    modalRef.componentInstance.restaurantTable = this.restaurantTables.find(data => data.tableId === tableId);
    // modalRef.componentInstance.restaurantTableSaved.subscribe(() => {

    // });
    // modalRef.result.then((result) => {
    //   if (result === 'Close after saving') {
    //    // alert("bruh");
    //   }
    // });
  }

  getRestaurantTables() {
    this.restaurantTableService.getCache().subscribe(
      data => {
        this.restaurantTables = data;
      }
    );
  }

  getReservations() {
    this.reservationService.getCache().subscribe(
      data => {
        this.reservations = data.filter(data => data.userId === this.user?.userId);
      }
    );
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
        console.log("Cập nhật số lượng: " + this.cartDetails[index].quantity)
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
        const modalRef = this.modalService.open(ChooseMenuItemComponent, {
          size: 'xl', // xl là kích thước lớn hơn
          centered: false, // Đặt modal ở giữa trang
          scrollable: true, // Cho phép cuộn nếu modal quá lớn
        });
      }
    }
  }

  handleCheckout(reservationId: number | undefined) {
    if (reservationId) {
      console.log(this.selectReservation);
      this.reservationService.getOrderByReservationId(reservationId)?.subscribe({
        next: (response) => {
          if (response) {
            sessionStorage.setItem('orderIdByReservation', JSON.stringify(response[0].orderId));
            sessionStorage.setItem('orderDetails_Reservation', JSON.stringify(response));
            console.log('response' + (response));
            let total_amount = 0;
            if (this.products) {
              for (const total of response) {
                for (const product of this.products) {
                  if (total.menuItemId === product.menuItemId) {
                    total_amount += total.quantity * product.unitPrice;
                  }
                }
              }
            }
            console.log('total' + (total_amount));
            this.toastService.showConfirmAlert('Xác nhận thanh toán', '')
              .then((result) => {
                if (result.isConfirmed) {
                  let orderInfo = sessionStorage.getItem('orderIdByReservation') + "," || ""; // dữ liệu order detail
                  for (const cart of response) {
                    orderInfo += cart.orderDetailId + ",";
                  }
                  orderInfo = orderInfo.replace(/,$/, "");
                  if (total_amount && orderInfo) {
                    this.vnpayService.submitOrder(total_amount, orderInfo).subscribe({
                      next: (data: any) => {
                        if (data.redirectUrl) {
                          window.location.href = data.redirectUrl; // Chuyển hướng đến URL được trả về từ backend
                          this.onGetPaymentStatus();
                        } else {
                          // Xử lý các trường hợp khác nếu cần
                        }
                      },
                      error: (error: any) => {
                        console.error('Failed to submit order. Please try again.', error);
                      }
                    });
                    console.log('Thanh toán bằng VNPAY');
                  }
                } else if (result.dismiss === Swal.DismissReason.cancel) {

                }
              });
          }
        },
        error: (error) => {
          this.toastService.showTimedAlert('Thêm thất bại', error, 'error', 2000);
        }
      });

    }
  }

  onGetPaymentStatus(): void {
    this.vnpayService.getPaymentStatus().subscribe(
      (data: any) => {
        if (data.paymentStatus === 1) {
          this.paymentStatus = 'Order success';
          // Hiển thị thông tin thanh toán nếu cần
          console.log('Order Info:', data.orderInfo);
          console.log('Payment Time:', data.paymentTime);
          console.log('Transaction ID:', data.transactionId);
          console.log('Total Price:', data.totalPrice);
        } else {
          this.paymentStatus = 'Order failed';
        }
      },
      (error: any) => {
        console.error('Failed to get payment status. Please try again.', error);
      }
    );
  }


  orderReservation() {
    if (this.selectedItems.length <= 0) {
      this.toastService.showTimedAlert('Vui lòng chọn sản phẩm', '', 'error', 2000);
    } else {
      this.reservationService.order(this.selectedItems, this.cartDetails, this.selectReservation as number)?.subscribe({
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

  isSearching = false;
  search() {
    if (this.keywords.trim() === '') {
      this.isSearching = false;
      this.getReservations();
    } else {
      this.reservationService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.isSearching = true;
          this.thisUserReservations = data.filter(data => data.userId === this.user?.userId);
        }
      );
    }
  }

  fieldName!: keyof Reservation;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any) {
    this.keywords = event.target.value;
    this.search();
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