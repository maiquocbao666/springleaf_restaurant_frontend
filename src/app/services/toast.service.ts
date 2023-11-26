import { Injectable } from "@angular/core";
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from "ngx-toastr";
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
  ) { }


  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
    Swal.fire({
      title,
      text: message,
      icon: type,
      confirmButtonText: 'OK'
    });
  }

  showCustomAnimatedAlert(title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success', animationClass: string) {
    return Swal.fire({
      title: title,
      icon: icon,
      customClass: {
        popup: animationClass
      }
    });
  }
  // gọi ở component 
  // showCustomAnimationAlert() {
  //   this.sweetAlertService.showCustomAnimatedAlert('Custom animation message', 'success', 'animated tada')
  //     .then((result) => {
  //  
  //     });
  // }

  showTimedAlert(title: string, message: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success', duration: number = 2000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      timer: duration,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  showInputAlert() {
    Swal.fire({
      title: 'Enter your email',
      input: 'email',
      inputLabel: 'Email address',
      inputPlaceholder: 'Enter your email address'
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          // Xử lý giá trị input
          Swal.fire(`Entered email: ${result.value}`, '', 'info');
        }
      }
    });
  }

  showConfirmAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  }

  // gọi ở component 
  // showMessage() {
  //   this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         // Hành động khi người dùng xác nhận
  //         Swal.fire('Đã xóa!', 'Bạn đã xóa.', 'success');
  //       }
  //     });
  // }

  showCustomAlert(options: SweetAlertOptions) {
    Swal.fire(options);
  }

  showBasicAlert() {
    Swal.fire('Basic Alert', 'This is a basic alert!', 'info');
  }
}