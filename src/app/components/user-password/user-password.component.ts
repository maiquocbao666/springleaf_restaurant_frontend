import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent {
  @Input() selected: any;
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
  constructor(
    private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sweetAlertService: ToastService,
    private userService: UserService,
  ) {
    const restaurantsString = localStorage.getItem('restaurants');
    if (restaurantsString) {
      const parsedRestaurants: Restaurant[] = JSON.parse(restaurantsString);
      this.restaurants = parsedRestaurants;
      console.log('restaurant : ', this.restaurants)
    } else {
      console.error('No products found in local storage or the value is null.');
    }
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
    this.user = this.authService.getUserCache();
      
    this.authService.accessCodeCacheData$.subscribe((code) => {
      if (code != '' && code != null) {
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

  changeUserRestaurant() {
    console.log(this.selectedRestaurant);
    // if (this.user && this.selectedRestaurant) {
    //   const userUpdate: User = {
    //     userId: this.user.userId,
    //     fullName: this.user.fullName,
    //     username: this.user.username,
    //     password: this.user.password,
    //     email: this.user.email,
    //     address: this.user.address,
    //     phone: this.user.phone,
    //     restaurantBranchId: this.selectedRestaurant!,
    //     image: this.user.image,
    //     managerId: this.user.managerId,
    //     status: this.user.status,
    //   };
    //   console.log(this.selectedRestaurant);
    //   this.userService.updateProfile(userUpdate).subscribe(
    //     () => {
    //       this.authService.setUserCache(userUpdate);
    //       this.sweetAlertService.showTimedAlert('Cập nhật thành công', '', 'success', 1500);
    //       this.activeModal.close();
    //     },
    //     (error) => {
    //       console.error('Error updating profile:', error);

    //     }
    //   );
    // }

  }

  async changePassword() {
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

}




