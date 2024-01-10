import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { UserPasswordComponent } from 'src/app/components/user-password/user-password.component';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { Category } from 'src/app/interfaces/category';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserOrderHistoriesComponent } from './user-order-histories/user-order-histories.component';
import { Reservation } from 'src/app/interfaces/reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { LocationRestaurantComponent } from 'src/app/components/location-restaurant/location-restaurant.component';
import { BillInfoComponent } from 'src/app/components/bill-info/bill-info.component';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {

  navbarfixed: boolean = false; // Hiện header
  scrollCounter: number = 0;
  previousScrollY = 0;
  // Dữ liệu ở component 
  user: User | null = null;
  cartByUser: DeliveryOrder | null = null; // Thông tin đặt hàng giỏ hàng
  orderByUser: Order | null = null; // Thông tin order của giỏ hàng
  orderDetailByUser: CartDetail[] | null = null; // Thông tin chi tiết của order giỏ hàng
  orderDetailCount: number = 0; // Đếm số lượng hàng có trong giỏ hàng
  isConfigUserRestaurant: boolean = true;
  userRestaurant: Restaurant | null = null;
  // Dữ liệu ở cache
  restaurants: Restaurant[] | null = null;
  categories: Category[] | null = null;
  roles: String[] | null = null;
  isAdminHeader: boolean = false;
  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private deliveryOrderService: DeliveryOrderService,
    private orderService: OrderService,
    private cartDetailService: CartDetailService,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private toastService: ToastService,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private sweetAlertService: ToastService,
    private reservationService: ReservationService,
  ) {
    this.authService.getUserCache().subscribe(
      (data: any | null) => {
        this.user = data;
        if (data != null) {
          this.getUserDeliveryOrder();
          this.checkUserRestaurant();
        }
    });
    this.authService.roleCacheData$.subscribe((data) => {
      this.roles = data;
      if (!this.roles) {
        this.isAdminHeader = false;
      }
      if (this.roles && this.roles.length > 0) {
        const isAdminOrManager = this.roles.includes('ADMIN') || this.roles.includes('MANAGER');

        if (isAdminOrManager) {
          this.isAdminHeader = true;
          
        } else {
          this.isAdminHeader = false;
        }
      } else {
        this.isAdminHeader = false;
      }
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const orderInfo = params['orderInfo'];
      const totalPrice = params['totalPrice']

      if (email) {
        this.loginGoogleConfig(email);
      }
      else if (orderInfo === "ReservationPaymentReservationDeposit") {
        this.newReservationByRedirectUrl();
        this.openBillInfoModal("ReservationPaymentReservationDeposit", totalPrice);
      }
      if (orderInfo === "ReservationPaymentReservationOrderItem") {
        this.newReservationOrderItemByRedirectUrl();
        this.openBillInfoModal("ReservationPaymentReservationOrderItem", totalPrice);
      }
      if (orderInfo && orderInfo.includes("CartPayment")) {
        this.openBillInfoModal("CartPayment", totalPrice);
      }
    });

    this.getRestaurants();
    this.getCategories();
    this.checkUserRestaurant();
    this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'transition', 'top 0.3s ease-in-out');
    let prevScrollPos = window.scrollY;

    window.onscroll = () => {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos > currentScrollPos) {
        this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'top', '0');
      } else {
        this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'top', '-100%');
      }
      prevScrollPos = currentScrollPos;
    };
  }

  // Kiểm tra user có chọn nhà hàng chưa
  checkUserRestaurant() {
    if (this.user?.restaurantBranchId === null && this.isConfigUserRestaurant) {
      this.toastService.showConfirmAlert('Bạn chưa chọn chi nhánh', '', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.openUserRestaurant();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.isConfigUserRestaurant = false;
          }
        });
    } else {
      if (this.restaurants) {
        for (const item of this.restaurants) {
          if (item.restaurantId === this.user?.restaurantBranchId) {
            this.userRestaurant = item;
            break;
          }
        }
      }
    }
  }

  logOut(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        sessionStorage.removeItem('userCache');
        this.authService.setUserCache(null);
        this.authService.setRoleCache(null);
        this.orderDetailCount = 0;
        this.toastService.showTimedAlert('Đăng xuất thành công', 'Hẹn gặp lại', 'success', 1000);
      },
      error: (error) => {
        console.error('Logout failed', error);
        this.toastService.showTimedAlert('Xảy ra lỗi', '', 'error', 1000);
      }
    });
  }

  loginGoogleConfig(email: string): void {
    this.authService.loginWithGoogle(email).subscribe({
      next: (response) => {
        sessionStorage.setItem('access_token', response.access_token);
        this.authService.setUserCache(response.user);
        this.authService.setRoleCache(response.user.roleName);
        this.toastService.showTimedAlert('Đăng nhập thành công', '', 'success', 1000);
        this.router.navigate(['/user/index']);
      },
      error: (error) => {
        // Xử lý lỗi từ hàm loginWithGoogle ở đây
        console.error('Login Error:', error);
      }
    });
  }


  truncateString(inputString: string): string {
    // Tìm vị trí của khoảng trắng đầu tiên từ bên phải
    const firstSpaceIndex = inputString.lastIndexOf(' ');

    if (firstSpaceIndex !== -1) {
      // Cắt chuỗi từ bên phải đến khoảng trắng đầu tiên
      return inputString.slice(firstSpaceIndex + 1);
    } else {
      // Trường hợp không có khoảng trắng
      return inputString;
    }
  }

  checkRole() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    });

    this.http.get('http://localhost:8080/admin/checks', { headers, responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Response', response); // This should print the text response
        },
        error: (error) => {
          console.error('Error', error);
        }
      });
  }

  // Get dữ liệu từ cache
  getRestaurants(): void {
    this.restaurantService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }

  // Lấy dữ liệu cart 
  getUserDeliveryOrder(): void {
    this.deliveryOrderService.getUserCartCache().subscribe(
      (cached: any | null) => {
        if (cached === null) {
          console.log('Lấy dữ liệu Giỏ hàng mới từ API');
          this.deliveryOrderService.getUserCart().subscribe();
        } else {
          console.log('Lấy dữ liệu từ cache');
          this.cartByUser = cached;
          this.getUserOrders();
        }

      }
    );
  }

  // Lấy dữ liệu order
  getUserOrders(): void {
    this.orderService.getUserOrderCache().subscribe(
      (cached: any | null) => {
        if (cached === null && this.cartByUser) {
          console.log('Lấy dữ liệu Order mới');
          this.orderService.getUserOrder(this.cartByUser.deliveryOrderId as number).subscribe(
            response => {
              this.orderByUser = response;
              console.log(response);
            },
            error => {
              console.error('Error fetching user order:', error);
            }
          );
        } else if (this.cartByUser) {
          console.log('Lấy dữ liệu từ cache' + this.orderByUser);
          this.orderByUser = cached;
          this.getUserOrderDetails();
        }
      },
      error => {
        console.error('Error fetching user order cache:', error);
      }
    );
  }

  // Lấy dữ liệu order detail của cart
  getUserOrderDetails(): void {
    
    this.cartDetailService.getOrderDetailsCache().subscribe(
      (cached: any[] | null) => {
        if (cached === null && this.orderByUser !== null) {
          this.cartDetailService.getUserOrderDetail(this.orderByUser.orderId).subscribe();
        } else {
          this.orderDetailCount = 0;
          this.orderDetailByUser = cached;
          //this.orderDetailCount = cached?.length as number;
          for(let count of this.orderDetailByUser!){
            this.orderDetailCount += count?.quantity as number;
          }
          
        }

      }
    )
  }

  // Mở Model đến các component khác
  // Profile
  openProfileModel() {
    const modalRef = this.modalService.open(ProfileComponent, { size: 'lg' });
  }

  // Quên mật khẩu
  openUserPasswordModel() {
    const modalRef = this.modalService.open(UserPasswordComponent);
    modalRef.componentInstance.selected = 'password';
  }

  openUserRestaurant() {
    const modalRef = this.modalService.open(LocationRestaurantComponent, { size: 'lg' });
    modalRef.componentInstance.selected = 'restaurant';
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent, { size: 'lg' });
  }

  openBillInfoModal(
    info : string,
    totalPrice: number
    ){
    const modalRef = this.modalService.open(BillInfoComponent, { size: 'lg' });
    if(info === 'ReservationPaymentReservationDeposit'){
      modalRef.componentInstance.selected = 'ReservationPaymentReservationDeposit';
      modalRef.componentInstance.totalPrice = totalPrice;
    }
    if(info === 'ReservationPaymentReservationOrderItem'){
      modalRef.componentInstance.selected = 'ReservationPaymentReservationOrderItem';
      modalRef.componentInstance.totalPrice = totalPrice;
    }
    if(info === 'CartPayment'){
      modalRef.componentInstance.selected = 'CartPayment';
      modalRef.componentInstance.totalPrice = totalPrice;
    }

    
  }

  openOrderModal() {
    if (!this.authService.getUserCache()) {
      this.sweetAlertService.showTimedAlert('Không thể mở!', 'Mời đăng nhập', 'error', 3000);
    } else {
      const modalRef = this.modalService.open(UserOrderHistoriesComponent, { size: 'xl', scrollable: false, centered: false });
      modalRef.componentInstance.userId = this.authService.getCache()?.userId;

      // Subscribe to the emitted event
      modalRef.componentInstance.restaurantTableSaved.subscribe(() => {
        //this.getRestaurantTables(this.restaurantId, null); // Refresh data in the parent component
      });
    }
  }

  newReservationByRedirectUrl() {
    var newReservation = JSON.parse(localStorage.getItem('await_new_reservation')!);

    let reservationsCache: Reservation[] = [];
    this.reservationService.add(newReservation).subscribe(
      {
        next: (addedReservation) => {
          this.sweetAlertService.showTimedAlert('Chúc mừng!', 'Bạn đã đặt bàn thành công', 'success', 3000);
          reservationsCache.push(addedReservation);
          localStorage.setItem('reservations', JSON.stringify(reservationsCache));
          localStorage.removeItem('await_new_reservation');
          //this.router.navigate(['/user/index']);
        },
        error: (error) => {
          console.error('Error adding reservation:', error);
        },
        complete: () => {
          // Xử lý khi Observable hoàn thành (nếu cần)
        }
      }
    );
  }

  newReservationOrderItemByRedirectUrl() {
    const reservation = JSON.parse(localStorage.getItem('new_reservation_orderItem')!);

    let reservationsCache: Reservation[] = [];
    this.reservationService.add(reservation).subscribe(
      {
        next: (addedReservation) => {
          this.sweetAlertService.showTimedAlert('Chúc mừng!', 'Bạn đã đặt bàn thành công', 'success', 3000);
          this.newOrderItemByRedirectUrl(addedReservation.reservationId!).subscribe();
          reservationsCache.push(addedReservation);
          localStorage.setItem('reservations', JSON.stringify(reservationsCache));
          localStorage.removeItem('await_new_reservation');
          //this.router.navigate(['/user/index']);
        },
        error: (error) => {
          console.error('Error adding reservation:', error);
        },
        complete: () => {
          // Xử lý khi Observable hoàn thành (nếu cần)
        }
      }
    );
  }

  newOrderItemByRedirectUrl(reservationId: number) {
    const orderDetail = JSON.parse(localStorage.getItem('new_orderDetail_by_reservation')!);
    const token = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    });

    const orderDetailObservable = this.http.post<any>(
      `http://localhost:8080/public/create/orderDetail/reservationOrder/${reservationId}`,
      orderDetail,
      { headers: headers }
    );

    return orderDetailObservable;
  }



}
