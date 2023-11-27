import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    codeCache : string | null = null ;
    code: string = '';
    token: string = '';
    constructor(private authService: AuthenticationService,
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        private sweetAlertService: ToastService,
        ) {
        this.authService.setAccessCodeCacheData('');
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
        this.authService.accessCodeCacheData$.subscribe((code) => {
          if(code != '' && code !=null){
            console.log(code)
            this.codeCache = code.slice(-6);
            this.token = code.slice(0, -6);
            console.log(this.codeCache + 'token:  ' + this.token);
          } 
        })
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
            this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thất bại!', '', 'error', 2000);
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

  async getAccessCode() {
    const email = this.forgotPasswordForm.get('email')?.value;
    const typeCode = 'forgot'
    try{
      const codeResult = await this.authService.getAccessCode(email, typeCode);
      if(codeResult === true){
        this.sweetAlertService.showTimedAlert('Gửi mã xác nhận!', 'Vui lòng kiểm tra email.', 'success', 2000);
      }
    }catch{

    }
  }

compareInputWithCodeCache(): boolean {
  if(this.code === this.codeCache){
    console.log(this.code === this.codeCache);
    this.sweetAlertService.showTimedAlert('Xác nhận thành công!', '', 'success', 2000);
    return true;
  }else{
    this.sweetAlertService.showTimedAlert('Xác nhận thất bại!', '', 'error', 2000);
    return false;
  }
}

   

async forgotPassword(){
    const password = this.forgotPasswordForm.get('password')?.value;
    const token = this.token;
    await this.authService.forgotPassword(password,token);
  }
  
}

  


