import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {
  
  changePasswordForm: FormGroup;
  forgotPasswordForm: FormGroup;
  user: User | null = null;
  password: string = '';
  isCheckPassword: boolean = false;
  codeCache: string | null = null;
  restaurants: Restaurant[] | null = null;
  selectedRestaurant: number | null = null;
  code: string = '';
  token: string = '';
  isNewPasswordChange :boolean = false;
  @Input() selected: any;
  constructor(
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sweetAlertService: ToastService,
    private restaurantSerivce: RestaurantService,
  ) {

    this.authService.setAccessCodeCacheData('');
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, [Validators.nullValidator]],
      newPassword: [null, this.customPasswordValidator],
      reNewPassword: [null, [Validators.nullValidator]],
    })
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.nullValidator]],
      code: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
      repassword: [null, [Validators.nullValidator]],
    })
    this.authService.getUserCache().subscribe(
      (data) => {
        this.user = data;
      }
    );

    this.authService.accessCodeCacheData$.subscribe((code) => {
      if (code != '' && code != null) {
        this.codeCache = code.slice(-6);
        this.token = code.slice(0, -6);
        console.log(this.codeCache + 'token:  ' + this.token);
      }
    })
  };
  ngOnInit() {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantSerivce.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  async configPassword() {
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

  async changePassword() {
    const password = this.changePasswordForm.get('newPassword')?.value;
    const configPassword = this.changePasswordForm.get('reNewPassword')?.value;
    if (password === configPassword) {
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
    } else {
      this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thất bại', '', 'error', 1000);
    }

  }

  async getAccessCode() {
    const email = this.forgotPasswordForm.get('email')?.value;
    const typeCode = 'forgot'
    try {
      const codeResult = await this.authService.getAccessCode(email, typeCode);
      if (codeResult === true) {
        this.sweetAlertService.showTimedAlert('Gửi mã xác nhận!', 'Vui lòng kiểm tra email.', 'success', 2000);
      }
    } catch {

    }
  }

  compareInputWithCodeCache(): boolean {
    if (this.code === this.codeCache) {
      console.log(this.code === this.codeCache);
      this.sweetAlertService.showTimedAlert('Xác nhận thành công!', '', 'success', 2000);
      return true;
    } else {
      this.sweetAlertService.showTimedAlert('Xác nhận thất bại!', '', 'error', 2000);
      return false;
    }
  }



  async forgotPassword() {
    const password = this.forgotPasswordForm.get('password')?.value;
    const token = this.token;
    await this.authService.forgotPassword(password, token);
  }



//----------------Valid---------------------//
customPasswordValidator(control: AbstractControl) {
  const password = control.value;
  
  if (!password) {
    return { 'required': true, 'message': 'Mật khẩu không được để trống' };
  }

  if (password.length < 6) {
    return { 'minLength': true, 'message': 'Mật khẩu phải ít nhất 6 ký tự' };
  }

  if (password.length > 12) {
    return { 'maxLength': true, 'message': 'Mật khẩu tối đa 12 ký tự' };
  }

  if (!/[A-Z]/.test(password)) {
    return { 'uppercase': true, 'message': 'Mật khẩu phải có ký tự viết hoa' };
  }

  if (!/\d/.test(password)) {
    return { 'digit': true, 'message': 'Mật khẩu phải ít nhất 1 ký tự số' };
  }
  return null;
}
//--------------END-Valid-------------------//



}
