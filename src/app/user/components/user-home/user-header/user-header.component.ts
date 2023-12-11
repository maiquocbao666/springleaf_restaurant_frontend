import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { UserPasswordComponent } from 'src/app/components/user-password/user-password.component';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { Category } from 'src/app/interfaces/category';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent {

  navbarfixed: boolean = false; // Hiện header
  scrollCounter: number = 0;
  previousScrollY = 0;
  user: User | null = null;
  cartByUser: DeliveryOrder | null = null;
  orderByUser: Order | null = null;
  orderDetailByUser: CartDetail[] | null = null;
  orderDetailCount: number | null = null;
  isConfigUserRestaurant: boolean = true;
  restaurants: Restaurant[] | null = null;
  categorys: Category[] | null = null;
  roles: String[] | null = null;
  isAdminHeader: boolean = false;
  userRestaurant : Restaurant | null = null;
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
  ) {
    const categoresString = localStorage.getItem('categories');
    if (categoresString) {
      const parsedCategories: Category[] = JSON.parse(categoresString);
      this.categorys = parsedCategories;
    } else {
      console.error('No products found in local storage or the value is null.');
    }
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
    this.cartDetailService.orderDetails$.subscribe((orderDetails) => {
      this.orderDetailByUser = orderDetails;
      this.orderDetailCount = orderDetails?.length as number;
    });

  }

  checkUserRestaurant() {
    console.log('branch id: ', this.user?.restaurantBranchId);
    if (this.user?.restaurantBranchId === null) {
      // console.log('vô đây')
      this.toastService.showConfirmAlert('Bạn chưa chọn chi nhánh', 'OK', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.openUserRestaurant();
            console.log('ok');
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log('cancel');
          }
        });
    }else{
      if(this.restaurants){
        for (const item of this.restaurants) {
          console.log(item);
          if (item.restaurantId === this.user?.restaurantBranchId) {
            this.userRestaurant = item;
            break;
          }
        }
      }
      
    }
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent, { size: 'lg' });
  }

  logOut(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful', response);
        this.authService.setUserCache(null);
        this.authService.setRoleCache(null);
        this.cartDetailService.setOrderDetails(null);
        this.orderDetailCount = 0;
        this.toastService.showTimedAlert('Đăng xuất thành công', 'Hẹn gặp lại', 'success', 1000);
      },
      error: (error) => {
        console.error('Logout failed', error);
        this.toastService.showTimedAlert('Xảy ra lỗi', '', 'error', 1000);
      }
    });
  }

  getUserCart() {
    this.deliveryOrderService.getUserCart().subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
        if (response) {
          this.getUserOrder(this.cartByUser?.deliveryOrderId as number);
        }
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }

  getUserOrder(deliveryOrderId: number) {
    this.orderService.getUserOrder(deliveryOrderId).subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
        if (response) {
          this.getUserOrderDetail(this.orderByUser?.orderId as number);
        }
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }


  getUserOrderDetail(orderId: number) {
    this.cartDetailService.getUserOrderDetail(orderId).subscribe({
      next: (response) => {
        console.log('GetUserOrder: ', response);
      },
      error: (error) => {
        console.error('Error fetching user order:', error);
      }
    });
  }


  ngOnInit(): void {
    //this.user = this.authService.getUserCache(); 
    this.getRestaurants();
    this.renderer.setStyle(this.el.nativeElement.querySelector('#navbar'), 'transition', 'top 0.3s ease-in-out');
    let prevScrollPos = window.scrollY;
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      console.log(this.user);
      if (this.user != null) {
        this.getUserCart();
        this.checkUserRestaurant();
      }
    });
    this.authService.roleCacheData$.subscribe((data) => {
      this.roles = data;
      console.log(this.roles);
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
    const restaurantsString = localStorage.getItem('restaurants');
    if (restaurantsString) {
      const parsedRestaurants: Restaurant[] = JSON.parse(restaurantsString);
      this.restaurants = parsedRestaurants;
      console.log('restaurant : ', this.restaurants)
    } else {
      console.error('No products found in local storage or the value is null.');
    }
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

  openProfileModel() {
    const modalRef = this.modalService.open(ProfileComponent);
  }

  openUserPasswordModel() {
    const modalRef = this.modalService.open(UserPasswordComponent);
    modalRef.componentInstance.selected = 'password';
  }

  openUserRestaurant() {
    const modalRef = this.modalService.open(UserPasswordComponent);
    modalRef.componentInstance.selected = 'restaurant';
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

  getHighestRole(test: string[]) {
    console.log(test);
    const predefinedRoles = ['USER', 'MANAGER', 'ADMIN'];
    
    let foundRole: string | null = null;

    for (const role of predefinedRoles) {
        if (test.includes(role)) {
            foundRole = role;
        } else {
            // Nếu không tìm thấy, thoát vòng lặp
            break;
        }
    }

    if (foundRole) {
      console.log(foundRole);
        return foundRole;
    }

    console.log('USER');
    // Mặc định trả về 'USER' nếu không có role nào khớp
    return 'USER';
}

getRestaurants(): void {
  this.restaurantService.getCache().subscribe(
    (cached: any[]) => {
      this.restaurants = cached;
    }
  );
}


}
