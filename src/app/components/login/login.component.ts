import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  active: string = "login";
  fullName: string = '';
  username: string = '';
  password: string = '';
  phone: string = '';
  userEmail: string = '';
  address: number | null = null;
  image: string = '';
  managerId: number | null = null;
  restaurantBranchId: number | null = null;
  roleId: number | null = null;
  user: User | null = null;
  loginForm: FormGroup;
  registerForm: FormGroup;
  areEmailAndCodeEntered: boolean = false;
  code : string = '';
  getDatasOfThisUserWorker: Worker;
  errorMessage: string | undefined;

  constructor(private authService: AuthenticationService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sweetAlertService: ToastService) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
    })
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
      repassword: [null, [Validators.nullValidator, this.passwordMatchValidator()]],
      phone: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
      code: [null, [Validators.nullValidator]],
    })
    // Đăng ký để theo dõi sự thay đổi trong userCache từ AuthenticationService
    this.authService.cachedData$.subscribe((user) => {
      this.user = user;
    });
    this.getDatasOfThisUserWorker = new Worker(new URL('../../workers/user/user-call-all-apis.worker.ts', import.meta.url));
    this.updateAreEmailAndCodeEntered();
  }

  ngOnInit() {
    this.registerForm.get('code')?.valueChanges.subscribe(() => this.updateAreEmailAndCodeEntered());
    this.registerForm.get('email')?.valueChanges.subscribe(() => this.updateAreEmailAndCodeEntered());
    
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const repassword = control.get('repassword')?.value;
  
      return password === repassword ? null : { 'passwordMismatch': true };
    };
  }
  updateAreEmailAndCodeEntered() {
    const code = this.registerForm.get('code')?.value;
    const email = this.registerForm.get('email')?.value;
    this.areEmailAndCodeEntered = !!code && !!email;

    // Enable/disable other fields based on code and email presence
    if (this.areEmailAndCodeEntered) {
      this.registerForm.get('fullName')?.enable();
      this.registerForm.get('username')?.enable();
      this.registerForm.get('password')?.enable();
      this.registerForm.get('repassword')?.enable();
    } else {
      this.registerForm.get('fullName')?.disable();
      this.registerForm.get('username')?.disable();
      this.registerForm.get('password')?.disable();
      this.registerForm.get('repassword')?.disable();
    }
  }
  
  // modal open form 
  onLoginTab(): void {
    this.active = "login";
  }

  onRegisterTab(): void {
    this.active = "register";
  }

  async login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      if (await this.authService.login(username, password) === true) {
        this.sweetAlertService.showTimedAlert('Đăng nhập thành công!', 'Chào mừng đăng nhập.', 'success', 2000)
        this.activeModal.close('Login Successful');
      }
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  async getAccessCode() {
      const email = this.userEmail;
      if (await this.authService.getAccessCode(email) === true) {
        this.toastr.success('Lấy mã thành công');
      }
  }

  register() {
    if (this.registerForm.valid) {
      const fullName = this.registerForm.get('fullName')?.value;
      const username = this.registerForm.get('username')?.value;
      const password = this.registerForm.get('password')?.value;
      const email = this.registerForm.get('email')?.value;
      const phone = this.registerForm.get('phone')?.value;

      this.authService.register(fullName, username, password, phone, email)
        .subscribe(
          (response) => {
            if (response.error === 'User with this email already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
            } else if (response.error === 'User with this username already exists') {
              console.log(response.error);
              this.errorMessage = response.error;
            } else {
              console.log(response);
              console.log('Registration successful');

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
}
