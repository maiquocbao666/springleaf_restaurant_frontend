import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-user-checkout',
  templateUrl: './user-checkout.component.html',
  styleUrls: ['./user-checkout.component.css']

})
export class UserCheckoutComponent {

  constructor(private sweetAlertService: ToastService) { }

  showCustomAnimationAlert() {
    this.sweetAlertService.showCustomAnimatedAlert('Custom animation message', 'success', 'animated tada')
      .then((result) => {
        // Xử lý kết quả nếu cần thiết
      });
  }
}
