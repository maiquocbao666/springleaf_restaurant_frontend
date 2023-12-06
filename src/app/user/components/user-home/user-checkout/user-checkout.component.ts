import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VNPayService } from 'src/app/services/VNpay.service';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
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
  cartInfos : CartInfomation[] = [];
  constructor(
    private sweetAlertService: ToastService,
    private vnpayService: VNPayService,
    private router: Router,
    private cartService : CartService,
  ) { 
    
  }


  ngOnInit(): void {
    // this.onGetPaymentStatus();
    this.cartInfos = this.cartService.getCartData()
    console.log(this.cartInfos)
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
