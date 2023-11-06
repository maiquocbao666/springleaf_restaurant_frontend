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
  private apiUrl = 'https://springleafrestaurantbackend.onrender.com/api/v1/auth';
  //private apiUrl = 'http://localhost:8080/api/v1/auth';
  private userCache: User | null = null;
  private cachedDataSubject = new BehaviorSubject<User | null>(null);
  getDatasOfThisUserWorker: Worker;

  constructor(private http: HttpClient, private apiService: ApiService) {

    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));

  }

  // Đây là một observable để theo dõi sự thay đổi trong userCache
  cachedData$: Observable<User | null> = this.cachedDataSubject.asObservable();

  setUserCache(user: User | null) {

    this.userCache = user;
    this.cachedDataSubject.next(user);

  }

  register(fullName: string, username: string, password: string, phone: string, email: string): Observable<any> {

    const registerData = {
      fullName: fullName,
      username: username,
      password: password,
      phone: phone,
      email: email,
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
          console.log("Login success");
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
          console.log("Auto Login success");

          resolve(true);

        }
      };

    });

  }



  loginWithGoogle() {

  }


  logout() {

    console.log("logout")
    localStorage.removeItem('jwtToken');

  }

  getUserCache(): User | null {

    return this.userCache;

  }

}
