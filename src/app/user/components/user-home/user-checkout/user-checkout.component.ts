import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VNPayService } from 'src/app/services/VNpay.service';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';
import { CartDetail } from 'src/app/interfaces/cart-detail';
import Swal from 'sweetalert2';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
@Component({
  selector: 'app-user-checkout',
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']

}) export class UserCheckoutComponent {
  orderTotal: number | undefined;
  orderInfo: string | undefined;
  submitted = false;
  paymentStatus: string | undefined;
  redirectUrl: string | undefined;
  selectedPaymentMethod: string | undefined;
  cartInfos: CartInfomation[] = [];
  orderByUser: Order | null = null;
  constructor(
    private vnpayService: VNPayService,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private http: HttpClient,
    private toast : ToastService
  ) {
    this.orderService.userOrderCache$.subscribe(order => {
      this.orderByUser = order;
    });
  }


  ngOnInit(): void {
    // this.onGetPaymentStatus();
    this.cartInfos = this.cartService.getCartData();
    console.log(this.cartInfos)
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    this.cartInfos.forEach((item) => {
      totalPrice += item.quantity*item.menuItemPrice;
    });
    return totalPrice;
  };

  calculateFinalPrice(shipFee: number): any {
    const totalPrice = this.calculateTotalPrice();
    const finalPrice = totalPrice - shipFee;
    return finalPrice >= 0 ? this.formatAmount(finalPrice) : 0;
  };

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  calculateShippingFee() {
    const apiUrl = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
    const headers = new HttpHeaders({
      'token': 'd6f64767-329b-11ee-af43-6ead57e9219a',
      'shop_id': 'YOUR_SHOP_ID'
    });

    const requestData = {
      service_id: null, 
      insurance_value: this.calculateTotalPrice(),
      coupon: null,
      to_ward_code: 'WARD_CODE',
      to_district_id: 1,
      from_district_id: 2,
      weight: 1000,
      length: 10,
      width: 10,
      height: 10
    };

    this.http.post(apiUrl, requestData, { headers: headers })
      .subscribe(
        (response) => {
          console.log('Shipping Fee Response:', response);
          // Xử lý kết quả ở đây
        },
        (error) => {
          console.error('Shipping Fee Error:', error);
          // Xử lý lỗi ở đây
        }
      );
  }

  processPayment(): void {
    // Kiểm tra xem phương thức thanh toán nào được chọn
    if (this.selectedPaymentMethod === 'vnpay') {
      this.payWithVNPay();
    } else if (this.selectedPaymentMethod === 'momo') {
      this.payWithMoMo();
    } else if (this.selectedPaymentMethod === 'cod') {
      this.payWithCOD();
    } else {
      // Xử lý nếu không chọn phương thức thanh toán
      Swal.fire('Bạn chưa chọn phương thức thanh toán', 'vui lòng chọn!', 'info');
      console.error('Vui lòng chọn phương thức thanh toán.');
    }
  }

  payWithVNPay(): void {

    if (this.orderTotal && this.orderInfo) {
      this.vnpayService.submitOrder(this.orderTotal, this.orderInfo).subscribe({
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
  }

  // Sử dụng Router để điều hướng tới URL trả về từ backend
  redirectToPayment(): void {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
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

  payWithMoMo(): void {
    console.log('Thanh toán bằng MoMo');
  }

  payWithCOD(): void {
    console.log('Thanh toán bằng COD');
    const jwtToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const listItem: CartDetail[] = [];
    let totalAmount = 0;
    this.cartInfos.forEach((item) => {
      const cartDetail: CartDetail = {
        orderDetailId: item.orderDetailId,
        menuItemId: item.menuItem,
        orderId: item.order,
        quantity: item.quantity
      }
      totalAmount += item.quantity*item.menuItemPrice;
      listItem.push(cartDetail);
    });
    const orderId = this.orderByUser?.orderId;
    console.log(totalAmount)

    this.http.post(`http://localhost:8080/public/checkout-cod/${orderId}/${totalAmount}`, listItem, { headers: headers })
      .subscribe({
        next: (response : any) => {
          if(response.message === "Checkout success"){
            this.toast.showTimedAlert('Thanh toán thành công','Cám ơn quý khách','success',1500);
          }
          if(response === "Checkout failed"){
            this.toast.showTimedAlert('Thanh toán thất bại','Vui lòng kiểm tra lại','error',1500);
          }
          console.log('Response:', response);
        },
        error: (error) => {
          // Handle error
          console.error('Error:', error);
        }
      });
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
