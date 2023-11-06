import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { User } from '../interfaces/user';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'usersUrl';
  private userUrl = 'userUrl';
  usersCache: User[] | null = null;

  private profileSubject = new Subject<User>();

  getDatasOfThisUserWorker: Worker;

  constructor(private apiService: ApiService, private http: HttpClient) {

    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));

  }

  getUsers(): Observable<User[]> {

    if (this.usersCache) {

      return of(this.usersCache);

    }

    const usersObservable = this.apiService.request<User[]>('get', this.usersUrl);

    usersObservable.subscribe(data => {

      this.usersCache = data;

    });

    return usersObservable;

  }

  getProfile(): Observable<any> {

    return new Observable((observer) => {

      const token = localStorage.getItem('access_token');

      if (!token) {

        observer.error('Access token not found in Local Storage');
        return;

      }

      this.getDatasOfThisUserWorker.postMessage({

        type: 'profile',
        tokenUser: token

      });

      this.getDatasOfThisUserWorker.onmessage = ({ data }) => {

        if (data.profileResponse === null) {

          console.log("Not profile user data");
          observer.error(data.error);

        } else {

          observer.next(data.profileResponse);

        }

      };

    });

  }


  updateProfile(updatedUserData: User): Observable<any> {

    const token = localStorage.getItem('access_token');
    const url = `http://localhost:8080/api/auth/your-profile/update`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(url, updatedUserData, { headers });

  }



}