import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { User } from '../interfaces/user';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'users';
  private userUrl = 'user';
  usersCache: User[] | null = null;

  private profileSubject = new Subject<User>();
  private apiPostUrl = 'http://localhost:8080/public/create/uploadImage';

  getDatasOfThisUserWorker: Worker;

  constructor(
    private apiService: ApiService,
    private rxStompService: RxStompService,
    private sweetAlertService: ToastService,
    private http: HttpClient,
  ) {
    this.getDatasOfThisUserWorker = new Worker(new URL('../workers/user/user-call-all-apis.worker.ts', import.meta.url));
  }

  gets(): Observable<User[]> {
    const token = localStorage.getItem('access_token');
    const url = 'http://localhost:8080/manager/users';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<User[]>(url, null, { headers });
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
    const url = `http://localhost:8080/auth/your-profile/update`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(url, updatedUserData, { headers });

  }



  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(this.apiPostUrl, formData, { headers: headers });
  }


}