import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = ''; // Thay đổi base URL của API của bạn
  constructor(private http: HttpClient) { }

  setUrl(uri: string) {
    //this.baseUrl = 'https://springleafrestaurantbackend.onrender.com/public/' + uri;
    this.baseUrl = 'http://localhost:8080/public/' + uri;
  }

  request<T>(method: string, endpoint: string, data: any = null, customHeaders: HttpHeaders | null = null): Observable<T> {

    let headers: HttpHeaders;

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

        return this.http.get<T>(this.baseUrl, { headers }).pipe(

          tap(response => {

          }),

          catchError(this.handleError<T>(`GET ${this.baseUrl}`))

        );

      case 'post':

        this.setUrl(`create/${endpoint}`);

        return this.http.post<T>(this.baseUrl, data, { headers }).pipe(

          tap(response => {

          }),

          catchError(this.handleError<T>(`POST ${this.baseUrl}`))

        );

      case 'put':

        this.setUrl(`update/${endpoint}`);

        return this.http.put<T>(this.baseUrl, data, { headers }).pipe(

          tap(response => {

          }),

          catchError(this.handleError<T>(`PUT ${this.baseUrl}`))

        );

      case 'delete':

        this.setUrl(`delete/${endpoint}`);

        return this.http.delete<T>(this.baseUrl, { headers }).pipe(

          tap(response => {

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