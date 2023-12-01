import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/components/login/login.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { UserPasswordComponent } from 'src/app/components/user-password/user-password.component';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import { DeliveryOrder } from 'src/app/interfaces/delivery-order';
import { DeliveryOrderDetail } from 'src/app/interfaces/delivery-order-detail';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartDetailService } from 'src/app/services/cart-detail.service';
import { DeliveryOrderService } from 'src/app/services/delivery-order.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

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
  orderDetailCount : number | null = null;
  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private deliveryOrderService : DeliveryOrderService,
    private orderService : OrderService,
    private cartDetailService : CartDetailService,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private toastService : ToastService,
  ) {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;
      console.log(this.user);
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
      if(this.user != null){
        this.getUserCart();
      }
    });
    this.deliveryOrderService.userCart$.subscribe(cart => {
      this.cartByUser = cart;
      //this.getUserOrder(this.cartByUser?.deliveryOrderId as number);
    });
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
      //this.getUserOrderDetail(this.orderByUser?.orderId as number);
    });
    this.cartDetailService.orderDetails$.subscribe((orderDetails) => {
      this.orderDetailByUser = orderDetails;
      this.orderDetailCount = orderDetails?.length as number;
    });
    
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginComponent, { size: 'lg' });
  }

  logOut() {
    // Cập nhật userCache trước khi đăng xuất
    this.authService.setUserCache(null);
    this.authService.logout();
  }

  getUserLocation(){
    
  }

  getUserCart() {
    this.deliveryOrderService.getUserCart().subscribe({
      next: (response) => {
          console.log('GetUserOrder: ', response);
          if(response){
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
          if(response){
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

  openProfileModel() {
    const modalRef = this.modalService.open(ProfileComponent);
  }

  openUserPasswordModel(){
    const modalRef = this.modalService.open(UserPasswordComponent);
    modalRef.componentInstance.selected = 'password';
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

}
