import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

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
  email: string = '';
  address: number | null = null;
  image: string = '';
  managerId: number | null = null;
  restaurantBranchId: number | null = null;
  roleId: number | null = null;
  user: User | null = null;
  loginForm : FormGroup;
  registerForm : FormGroup;

  getDatasOfThisUserWorker: Worker;
  errorMessage: string | undefined;

  constructor(private authService: AuthenticationService,
    public activeModal: NgbActiveModal, private apiService: ApiService, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
    })
    this.registerForm = this.formBuilder.group({
      fullName: [null, [Validators.nullValidator]],
      username: [null, [Validators.nullValidator]],
      password: [null, [Validators.nullValidator]],
      phone: [null, [Validators.nullValidator]],
      email: [null, [Validators.nullValidator]],
    })
    // Đăng ký để theo dõi sự thay đổi trong userCache từ AuthenticationService
    this.authService.cachedData$.subscribe((user) => {
      this.user = user;
    });
    this.getDatasOfThisUserWorker = new Worker(new URL('../../workers/user/user-call-all-apis.worker.ts', import.meta.url));
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
        this.activeModal.close('Login Successful');
      }
    }
  }
  
  loginWithGoogle() {

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
              // Xử lý trường hợp email đã tồn tại
              console.log(response.error);
              this.errorMessage = response.error;
            } else if (response.error === 'User with this username already exists') {
              // Xử lý trường hợp username đã tồn tại
              console.log(response.error);
              this.errorMessage = response.error;
            } else {
              // Xử lý trường hợp đăng ký thành công
              console.log(response);
              console.log('Registration successful');
              this.active = 'login';
            }
          }
        );
    } else {
      console.error('Vui lòng nhập tên đăng nhập, mật khẩu và tên.');
    }
  }
  
}
