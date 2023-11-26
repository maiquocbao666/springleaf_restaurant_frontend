import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../interfaces/user';
import { ApiService } from './api.service';
import { UserInventoryBranchesModule } from '../user/components/user-home/user-inventory-branches/user-inventory-branches.module';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // private apiUrl = 'https://springleafrestaurantbackend.onrender.com/auth'; // Thay thế bằng URL của Spring Boot API
  private apiUrl = 'http://localhost:8080/auth';
  private userCache: User | null = null;
  private cachedDataSubject = new BehaviorSubject<User | null>(null);
  private listRole  : String[] | null = null;
  private listRoleDataSubject = new BehaviorSubject<String[] | null>(null);
  private accessCode  : string | null = null;
  private accessCodeDataSubject = new BehaviorSubject<string | null>(null);
  getDatasOfThisUserWorker: Worker;

  constructor(private http: HttpClient) {

    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));

  }

  // Đây là một observable để theo dõi sự thay đổi trong userCache
  cachedData$: Observable<User | null> = this.cachedDataSubject.asObservable();
  roleCacheData$: Observable<String[] | null> = this.listRoleDataSubject.asObservable();
  accessCodeCacheData$: Observable<string | null> = this.accessCodeDataSubject.asObservable();
  setUserCache(user: User | null) {
    this.userCache = user;
    this.cachedDataSubject.next(user);
  }

  getAccessCode(email: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      
      this.getDatasOfThisUserWorker.postMessage({
        type: 'get-access-code',
        email
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.accessCodeRespone === null) {
          console.log("Get Access Code Faile");
          resolve(false);
        } else {
          localStorage.setItem('access_code', data.accessCodeRespone);
          console.log('Authentication service : ' + data.accessCodeRespone);
          this.accessCode = data.accessCodeRespone;
          this.accessCodeDataSubject.next(data.accessCodeRespone);
          console.log("Get Access Code  success");
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

  login(username: string, password: string): Promise<boolean> {
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
        if (data.loginResponse === null) {
          console.log("Login failed");
          resolve(false);
        } else {
          localStorage.setItem('access_token', data.loginResponse.access_token);
          localStorage.setItem('refresh_token', data.loginResponse.refresh_token);
          localStorage.setItem('user_login_name', data.loginResponse.user.lastName);
          this.setUserCache(data.loginResponse.user);
          this.listRole = data.loginResponse.user.roleName;
          this.listRoleDataSubject.next(data.loginResponse.user.roleName);
          console.log("Login success");
          resolve(true);
        }
      };
    });
  }

  configPassword(password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const token = localStorage.getItem('access_token');
      this.getDatasOfThisUserWorker.postMessage({
        type: 'config-password',
        password, token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.configPasswordResponse === null) {
          console.log("Call Config Password Faile");
          resolve(false);
        }
        else if(data.configPasswordResponse === "User not found"){
          console.log("User not found");
          resolve(false);
        }
        else if(data.configPasswordResponse === "Config password faile"){
          console.log("Password is not correct");
          resolve(false);
        }
        else {
          console.log("Config Password success");
          resolve(true);
        }
      };
    });
  }

  changePassword(password: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const token = localStorage.getItem('access_token');
      this.getDatasOfThisUserWorker.postMessage({
        type: 'change-password',
        password, token
      });
      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {
        if (data.configPasswordResponse === null) {
          console.log("Call Change Password Faile");
          resolve(false);
        }
        else if(data.configPasswordResponse === "User not found"){
          console.log("User not found");
          resolve(false);
        }
        else if(data.configPasswordResponse === "Change password faile"){
          console.log("Password is not correct");
          resolve(false);
        }
        else {
          console.log("Change Password success");
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

          console.log("Phiên làm việc hết hạn");
          resolve(false);

        } else if (data.checkTokenRespone.error === 'Token was wrong') {

          console.log("Token không đúng");
          resolve(false);

        }
        else {

          localStorage.setItem('user_login_name', data.checkTokenRespone.user.fullName);
          localStorage.setItem('access_token', data.checkTokenRespone.access_token);
          this.setUserCache(data.checkTokenRespone.user);
          this.listRole = data.checkTokenRespone.user.roleName;
          this.listRoleDataSubject.next(data.checkTokenRespone.user.roleName);
          console.log("Auto Login success");

          resolve(true);

        }
      };

    });

  }



  loginWithGoogle() {
    this.getDatasOfThisUserWorker.postMessage({
      type: 'login-with-google'
    });
    console.log("Vô tới auth");
  }


  logout() {
    console.log("logout")
    localStorage.removeItem('access_token');

  }

  getUserCache(): User | null {

    return this.userCache;

  }

}
