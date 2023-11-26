import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-profile',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {
    @Input() selected: any;
    changePasswordForm :FormGroup;
    forgotPasswordForm : FormGroup;
    user : User | null = null;
    password: string = '';
    isCheckPassword : boolean = false;
    constructor(private authService: AuthenticationService,
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private sweetAlertService: ToastService,
        private modalService: NgbModal) {
        this.changePasswordForm = this.formBuilder.group({
          oldPassword: [null, [Validators.nullValidator]],
          newPassword: [null, [Validators.nullValidator]],
          reNewPassword: [null, [Validators.nullValidator]],
        })
        this.forgotPasswordForm = this.formBuilder.group({
            email: [null, [Validators.nullValidator]],
            code: [null, [Validators.nullValidator]],
          password: [null, [Validators.nullValidator]],
          repassword: [null, [Validators.nullValidator]],
        })
        this.authService.cachedData$.subscribe((data) => {
            this.user = data;
            console.log(this.user);
            // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
          });
    };
    ngOnInit() {
        console.log(this.selected);
    }

    async configPassword(){
        const password = this.password;
        try {
          const configPasswordResult = await this.authService.configPassword(password);
    
          if (configPasswordResult === true) {
            this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thành công!', '', 'success', 2000);
            this.isCheckPassword = true;
          } else {
            console.error('Xác nhận mật khẩu sai failed');
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
    }

    async changePassword(){
      const password = this.changePasswordForm.get('newPassword')?.value;
      try {
        const changePasswordResult = await this.authService.changePassword(password);
  
        if (changePasswordResult === true) {
          
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thành công!', '', 'success', 2000);
          this.activeModal.close('Login Successful');
        } else {
          console.error('Xác nhận mật khẩu sai failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
  }

   

    forgotPassword(){

    }
  
}

  


