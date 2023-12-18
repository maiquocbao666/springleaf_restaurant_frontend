import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, switchMap} from 'rxjs';
import { User } from '../interfaces/user';
import { ToastService } from './toast.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //private apiUrl = 'https://springleafrestaurantbackend.onrender.com/auth'; // Thay thế bằng URL của Spring Boot API
  private apiUrl = 'http://localhost:8080/auth';
  // User cache
  private userCache: User | null = null;
  private userCachedDataSubject = new BehaviorSubject<User | null>(null);
  userCache$: Observable<User | null> = this.userCachedDataSubject.asObservable();

  private listRole  : string[] | null = null;
  private listRoleDataSubject = new BehaviorSubject<String[] | null>(null);
  private accessCode  : string | null = null;
  private accessCodeDataSubject = new BehaviorSubject<string | null>(null);
  getDatasOfThisUserWorker: Worker;

  constructor(private http: HttpClient,
    private sweetAlertService: ToastService,
    private cookieService: CookieService
    ) {
    const storedUser = sessionStorage.getItem('userCache');
    if (storedUser) {
      this.userCache = JSON.parse(storedUser);
      console.log(this.userCache);
    }
    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));
  }

  // Đây là một observable để theo dõi sự thay đổi trong userCache
  roleCacheData$: Observable<String[] | null> = this.listRoleDataSubject.asObservable();
  accessCodeCacheData$: Observable<string | null> = this.accessCodeDataSubject.asObservable();
  //  ----------------------------------------------------------------------------------- 
  // Getter & Setter cho user
  setUserCache(user: User | null) : void {
    this.userCachedDataSubject.next(user);
    this.userCache = user;
    sessionStorage.setItem('userCache', JSON.stringify(user));
  }
  getUserCache(): Observable<User | null> {
    return this.userCache$;
  }
  getCache() {
    console.log(this.userCache)
    return this.userCache;
  }
  // -----------------------------------------
  setRoleCache(roles: string[] | null) {
    this.listRole = roles;
    this.listRoleDataSubject.next(roles);
    sessionStorage.setItem('userRoles', JSON.stringify(roles));
  }
  getRoleCache(): string[] | null {
    return this.listRole;
  }
  
  setAccessCodeCacheData(code: string) {
    this.accessCode = code;
    this.accessCodeDataSubject.next(code);
  }
  // -----------------------------------------------------------------------------------
  getAccessCode(email: string, typeCode: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getDatasOfThisUserWorker.postMessage({
        type: 'get-access-code',
        email, typeCode
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.accessCodeRespone === null) {
          console.log("Get Access Code Faile");
          resolve(false);
        }else if(data.accessCodeRespone === 'User with this email already exists'){
          this.sweetAlertService.showTimedAlert('Thất bại!', 'Email đã được sử dụng.', 'error', 2000);
          resolve(false);
        } else {
          localStorage.setItem('access_code', data.accessCodeRespone);
          this.accessCode = data.accessCodeRespone;
          this.accessCodeDataSubject.next(data.accessCodeRespone);
          this.sweetAlertService.showTimedAlert('Gửi mã xác nhận!', 'Vui lòng kiểm tra email.', 'success', 2000);
          resolve(true);
        }
      };
    });
  }
  
  register(fullName: string, username: string, password: string, phone: string, email: string, code: string): Observable<any> {
    const registerData = {
      fullName: fullName,
      username: username,
      password: password,
      phone: phone,
      email: email,
      jwtToken: code,
    };
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  login(username: string, password: string, rememberMe: boolean): Promise<boolean> {
    
    return new Promise<boolean>((resolve, reject) => {
      const loginData = {
        userName: username,
        password: password
      };
      this.getDatasOfThisUserWorker.postMessage({
        type: 'login',
        loginData
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.loginResponse.error === "User not found") {
          this.sweetAlertService.showTimedAlert('Đăng nhập thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }else if (data.loginResponse.error === "Account is disabled") {
          this.sweetAlertService.showTimedAlert('Tài khoản bị vô hiệu hóa', 'Vui lòng liên hệ quản trị viên', 'error', 2000);
          resolve(false);
        }
        else if (data.loginResponse.error === "Invalid username or password") {
          this.sweetAlertService.showTimedAlert('Đăng nhập thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else {
          localStorage.setItem('user_login_name', data.loginResponse.user.fullName);
          localStorage.setItem('access_token', data.loginResponse.access_token);
          sessionStorage.setItem('access_token', data.loginResponse.access_token);
          this.setUserCache(data.loginResponse.user);
          this.setRoleCache(data.loginResponse.user.roleName);
          if(rememberMe){
            this.cookieService.set('access_token', data.loginResponse.access_token); // Lưu jwt cho lần đăng nhập sau
          }
          this.sweetAlertService.showTimedAlert('Đăng nhập thành công', '', 'success', 2000);
          resolve(true);
        }
      };
    });
  }
 

  configPassword(password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // const token = localStorage.getItem('access_token');
      const token = sessionStorage.getItem('access_token');
      this.getDatasOfThisUserWorker.postMessage({
        type: 'config-password',
        password, token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.configPasswordResponse === null) {
          this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else if(data.configPasswordResponse === "User not found"){
          this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else if(data.configPasswordResponse === "Config password faile"){
          this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else {
          this.sweetAlertService.showTimedAlert('Xác nhận mật khẩu thành công', '', 'success', 2000);
          resolve(true);
        }
      };
    });
  }

  changePassword(password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      //const token = localStorage.getItem('access_token');
      const token = sessionStorage.getItem('access_token');
      this.getDatasOfThisUserWorker.postMessage({
        type: 'change-password',
        password, token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.configPasswordResponse === null) {
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else if(data.configPasswordResponse === "User not found"){
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else if(data.configPasswordResponse === "Change password faile"){
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thất bại', 'Vui lòng thử lại', 'error', 2000);
          resolve(false);
        }
        else {
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thành công', '', 'success', 2000);
          resolve(true);
        }
      };
    });
  }

  forgotPassword(password: string, token: String): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getDatasOfThisUserWorker.postMessage({
        type: 'forgot-password',
        password, token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.forgotPasswordResponse === null) {
          console.log("Call Forgot Password Faile");
          resolve(false);
        }
        else if(data.forgotPasswordResponse === "User not found"){
          console.log("User not found");
          resolve(false);
        }
        else if(data.forgotPasswordResponse === "Change password faile"){
          this.sweetAlertService.showTimedAlert('Đổi mật khẩu thất bại', '', 'error', 2000);
          resolve(false);
        }
        else {
          this.sweetAlertService.showTimedAlert('Lấy lại mật khẩu thành công', '', 'success', 2000);
          resolve(true);
        }
      };
    });
  }

  checkUserByAccessToken(accessToken: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const token = accessToken;
      this.getDatasOfThisUserWorker.postMessage({
        type: 'check_access_token',
        token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {

        if (data.checkTokenRespone.error === 'Session has expired') {
          this.sweetAlertService.showTimedAlert('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại', 'error', 2000);
          this.setUserCache(null);
          resolve(false);

        } else if (data.checkTokenRespone.error === 'Token was wrong') {
          this.sweetAlertService.showTimedAlert('Token không hợp lệ', '', 'error', 2000);
          resolve(false);
        }
        else {
          localStorage.setItem('user_login_name', data.checkTokenRespone.user.fullName);
          localStorage.setItem('access_token', data.checkTokenRespone.access_token);
          sessionStorage.setItem('access_token', data.checkTokenRespone.access_token);
          this.setUserCache(data.checkTokenRespone.user);
          this.setRoleCache(data.checkTokenRespone.user.roleName);
          // this.listRole = data.checkTokenRespone.user.roleName;
          // this.listRoleDataSubject.next(data.checkTokenRespone.user.roleName);
          //this.sweetAlertService.showTimedAlert('Tự động đăng nhập', '', 'success', 1000);
          resolve(true);

        }
      };

    });

  }
  loginGoogle(): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.get<any>(url, {});
  }


  loginWithGoogle(email: string): Observable<any> {
    const url = `${this.apiUrl}/login-with-google/${email}`;
    return this.http.post<any>(url, {});
  }

  logout(): Observable<any> {
    // const jwtToken = localStorage.getItem('access_token');
    const jwtToken = sessionStorage.getItem('access_token');
    if (!jwtToken) {
      return of(null);
    }

    const customHeader = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });

    return this.http.post<any>('http://localhost:8080/auth2/logout', null, {
      headers: customHeader,
    });
    // return this.http.post<any>('https://springleafrestaurantbackend.onrender.com/auth2/logout', null, {
    //   headers: customHeader,
    // });
  }

  

}
