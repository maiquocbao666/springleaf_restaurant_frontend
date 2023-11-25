import { Component } from '@angular/core';
import { VNPayService } from 'src/app/services/VNpay.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-user-checkout',
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']

})
export class UserCheckoutComponent {
  constructor(
    private sweetAlertService: ToastService,
    private vnpayService: VNPayService,

  ) {

  }



  onSubmit(form: any) {
    if (form.valid) {
      const orderTotal = form.value.orderTotal;
      const orderInfo = form.value.orderInfo;
      alert("Xin chào" + orderTotal);
      this.vnpayService.submitOrder(orderTotal, orderInfo).subscribe({

        next: (response: any) => {
          if (response && response.vnpayUrl) {
            window.location.href = response.vnpayUrl;
            alert(response.vnpayUrl)
          } else {
            // Xử lý khi có lỗi từ phản hồi
          }
        },
        error: (error: any) => {
          // Xử lý khi gọi API gặp lỗi
        }
      });

    } else {
      alert("Lôizzz");
    }
  }

  // Phương thức để kiểm tra trạng thái thanh toán
  checkPaymentStatus(request: any) {
    this.vnpayService.getPaymentStatus(request).subscribe(
      response => {
        // Xử lý response từ backend sau khi gọi API getPaymentStatus
        // Dựa vào response để hiển thị thông tin thanh toán cho người dùng
      },
      error => {
        // Xử lý khi gọi API gặp lỗi
      }
    );
  }


  showCustomAnimationAlert() {
    this.sweetAlertService.showCustomAnimatedAlert('Custom animation message', 'success', 'animated tada')
      .then((result) => {
      });
  }


}
