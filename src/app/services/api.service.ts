import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  user: User | null = null;
  roles: String[] | null = [];
  private baseUrl = ''; // Thay đổi base URL của API của bạn

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
    this.authService.roleCacheData$.subscribe((data) => {
      this.roles = data;
      // Cập nhật thông tin người dùng từ userCache khi có sự thay đổi
    });
  }

  setUrl(uri: string) {

    //this.baseUrl = 'http://localhost:8080/public/' + uri;
    console.log('API Endpoint:', this.baseUrl);
    this.baseUrl = 'https://springleafrestaurantbackend.onrender.com/public/' + uri;

    //this.baseUrl = 'http://localhost:8080/public/' + uri;
  }

  request<T>(method: string, endpoint: string, data: any = null, customHeaders: HttpHeaders | null = null): Observable<T> {

    let headers: HttpHeaders;
    // Thêm logs để xác nhận thông tin
    console.log('Method:', method);
    console.log('Endpoint:', endpoint);
    console.log('Data:', data);

    if (customHeaders) {
      headers = customHeaders.append('Content-Type', 'application/json');
      // Thêm các headers khác nếu cần
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // Thêm các headers khác nếu cần
      });
    }

    switch (method.toLowerCase()) {

      case 'get':

        this.setUrl('' + endpoint);
        console.log("API Service: " + this.baseUrl);
        return this.http.get<T>(this.baseUrl, { headers }).pipe(

          tap(response => {
            console.log(response);
          }),

          catchError(this.handleError<T>(`GET ${this.baseUrl}`))

        );

      case 'post':

        this.setUrl(`create/${endpoint}`);

        return this.http.post<T>(this.baseUrl, data, { headers }).pipe(

          tap(response => {

            console.log(response);
          }),

          catchError(this.handleError<T>(`POST ${this.baseUrl}`))

        );

      case 'put':

        this.setUrl(`update/${endpoint}`);

        return this.http.put<T>(this.baseUrl, data, { headers }).pipe(

          tap(response => {
            console.log(response);
          }),

          catchError(this.handleError<T>(`PUT ${this.baseUrl}`))

        );

      case 'delete':

        this.setUrl(`delete/${endpoint}`);

        return this.http.delete<T>(this.baseUrl, { headers }).pipe(

          tap(response => {
            console.log(response);
          }),

          catchError(this.handleError<T>(`DELETE ${this.baseUrl}`))

        );

      default:

        throw new Error(`Unsupported HTTP method: ${method}`);

    }
  }

  private handleError<T>(operation = 'operation', result?: T) {

    return (error: any): Observable<T> => {

      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);

    };

  }

}