import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserPasswordComponent } from '../user-password/user-password.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  ui = true;
  error: string | undefined;

  active: string = "login";
  userEmail: string = '';
  user: User | null = null;
  loginForm: FormGroup;
  registerForm: FormGroup;
  areEmailAndCodeEntered: boolean = false;
  codeCache: string | null = null;
  code: string = '';
  token: string = '';
  getDatasOfThisUserWorker: Worker;
  errorMessage: string | undefined;
  browserInformation: any;

  constructor(private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sweetAlertService: ToastService,
    private modalService: NgbModal,
    private deviceService: DeviceDetectorService) {
    // Form đăng nhập
    this.loginForm = this.formBuilder.group({
      username: [null, [this.custormValidatorUsernameLogin]],
      password: [null, [this.customPasswordLoginValidator]],
      rememberMe: [false]
    });

    // Form đăng ký
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      password: [null, [this.customPasswordValidator]],
      repassword: [null, [Validators.nullValidator, this.passwordMatchValidator()]],
      phone: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
      code: [null, [Validators.nullValidator]],
    })
    this.authService.setAccessCodeCacheData('');
    // Đăng ký để theo dõi sự thay đổi trong userCache từ AuthenticationService
    this.authService.getUserCache().subscribe((user) => {
      this.user = user;
    });

    this.authService.accessCodeCacheData$.subscribe((code) => {
      if (code != '' && code != null) {
        console.log(code)
        this.codeCache = code.slice(-6);
        this.token = code.slice(0, -6);
        console.log(this.codeCache + 'token:  ' + this.token);
      }

    })

    this.getBrowserInformation();
    this.getDatasOfThisUserWorker = new Worker(new URL('../../workers/user/user-call-all-apis.worker.ts', import.meta.url));
  }

  ngOnInit() {
    // Kiểm tra nếu chưa lấy code xác nhận email không được nhập liệu
    // Ngăn chặn việc spam API 
    this.registerForm.get('fullName')?.disable();
    this.registerForm.get('username')?.disable();
    this.registerForm.get('phone')?.disable();
    this.registerForm.get('password')?.disable();
    this.registerForm.get('repassword')?.disable();

  }

  getBrowserInformation() {
    // Lấy thông tin của thiết bị đang sử dụng
    const deviceInfo = this.deviceService.getDeviceInfo();
    console.log(deviceInfo.browser);   // Tên trình duyệt
    console.log(deviceInfo.browser_version);  // Phiên bản trình duyệt
    console.log(deviceInfo.os);  // Hệ điều hành
    console.log(deviceInfo);
  }

  // Kiểm tra mã code đăng ký
  compareInputWithCodeCache(): boolean {
    if (this.code === this.codeCache) {
      this.sweetAlertService.showTimedAlert('Xác nhận thành công!', '', 'success', 2000);
      this.registerForm.get('fullName')?.enable();
      this.registerForm.get('username')?.enable();
      this.registerForm.get('phone')?.enable();
      this.registerForm.get('password')?.enable();
      this.registerForm.get('repassword')?.enable();
      return true;
    } else {
      this.sweetAlertService.showTimedAlert('Xác nhận thất bại!', '', 'error', 2000);
      return false;
    }
  }

  // Kiểm tra xác nhận mật khẩu
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const repassword = control.get('repassword')?.value;
      return password === repassword ? null : { 'Xác nhận mật khẩu sai': true };
    };
  }


  async login() {
    this.loading = true;
    this.error = undefined;
    this.ui = false;
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const rememberMe = this.loginForm.get('rememberMe')?.value;
      try {
        const loginResult = await this.authService.login(username, password, rememberMe);

        if (loginResult === true) {

          this.sweetAlertService.showTimedAlert('Đăng nhập thành công!', 'Chào mừng đăng nhập.', 'success', 2000);
          this.activeModal.close('Login Successful');
          this.loading = false;
          this.ui = true;

        } else {
          console.error('Login failed');
          this.error = 'Failed to fetch statistics. Please try again.';
          this.loading = false;
          this.ui = true;
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  // Lấy mã xác nhận đăng ký
  async getAccessCode() {
    const email = this.userEmail;
    const typeCode = 'register'
    await this.authService.getAccessCode(email, typeCode);
  }

  register() {
    if (this.registerForm.valid) {
      const fullname = this.registerForm.get('fullName')?.value;
      const username = this.registerForm.get('username')?.value;
      const password = this.registerForm.get('password')?.value;
      const email = this.registerForm.get('email')?.value;
      const phone = this.registerForm.get('phone')?.value;
      const code = this.token;
      const fullName = this.upperCase(fullname);

      this.authService.register(fullName, username, password, phone, email, code)
        .subscribe(
          (response) => {
            if (response.error === 'JWT is valid') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Mã xác nhận quá hạn', 'Vui lòng lấy mã mới', 'error', 2000);
            }
            else if (response.error === 'Role not found') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Lỗi quyền hạn', '', 'error', 2000);
            }
            else if (response.error === 'User with this email already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Đăng ký thất bại', 'Email đã được sử dụng', 'error', 2000);
            } else if (response.error === 'User with this username already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
              this.sweetAlertService.showTimedAlert('Đăng ký thất bại', 'Username đã được sử dụng', 'error', 2000);
            } else {
              console.log(response);
              console.log('Registration successful');
              this.sweetAlertService.showTimedAlert('Đăng ký thành công', '', 'success', 2000);
              const container = document.getElementById('container');
              if (container) {
                container.classList.remove('right-panel-active');
              }
            }
          }
        );
    } else {
      console.error('Vui lòng nhập tên đăng nhập, mật khẩu và tên.');

    }
  }

  //-------------------------Validator-----------------------------//
  upperCase(str: string): string {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  //----Form đăng ký----//
  customFullNameValidator(control: AbstractControl) {
    const fullName = control.value;
    if (!fullName) {
      return { 'required': true, 'message': 'Họ tên không được để trống' };
    }
    if (fullName.length > 50) {
      return { 'required': true, 'message': 'Họ tên quá dài' };
    }
    if (/[^a-zA-Z ]/.test(fullName)) {
      return { 'required': true, 'message': 'Không được chứa ký tự đặc biệt' };
    }
    if (/\d/.test(fullName)) {
      return { 'required': true, 'message': 'Không được chứa số' };
    }

    return true;
  }


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

  //----Form đăng nhập----//
  custormValidatorUsernameLogin(control: AbstractControl) {
    // const username = control.value;
    // if (!username) {
    //   return { 'required': true, 'message': 'Tài khoản không được để trống' };
    // }

    // if (username.length < 6) {
    //   return { 'minLength': true, 'message': 'Tài khoản phải ít nhất 6 ký tự' };
    // }

    // if (username.length > 12) {
    //   return { 'maxLength': true, 'message': 'Tài khoản tối đa 12 ký tự' };
    // }
    // const pattern = /^[a-zA-Z0-9]+$/;
    // if (!pattern.test(username)) {
    //   return { 'invalidUsername': true, 'message': 'Tài khoản không hợp lệ, chỉ cho phép chữ cái và số' };
    // }
    return null;
  }
  customPasswordLoginValidator(control: AbstractControl) {
    // const password = control.value;
    // if (!password) {
    //   return { 'required': true, 'message': 'Mật khẩu không được để trống' };
    // }

    // if (password.length < 6) {
    //   return { 'minLength': true, 'message': 'Mật khẩu phải ít nhất 6 ký tự' };
    // }

    // if (password.length > 12) {
    //   return { 'maxLength': true, 'message': 'Mật khẩu tối đa 12 ký tự' };
    // }
    return null;
  }

  //---------------------------End validator----------------------------------------//

  @ViewChild('container') container!: ElementRef;
  @ViewChild('signIn') signInButton!: ElementRef;
  @ViewChild('signUp') signUpButton!: ElementRef;

  ngAfterViewInit() {
    this.signUpButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('right-panel-active');
    });

    this.signInButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('right-panel-active');
    });
  }

  //--------------------------------- Bộ chuyển đổi giao diện --------------------------// 
  // Mở form đăng nhập
  onLoginTab(): void {
    this.active = "login";
  }

  // Mở form đăng ký
  onRegisterTab(): void {
    this.active = "register";
  }

  // Chuyển sang component quên mật khẩu
  openUserPasswordModel() {
    const modalRef = this.modalService.open(UserPasswordComponent);
    modalRef.componentInstance.selected = 'forgot-password';
  }
}
