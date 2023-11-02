import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://springleafrestaurantbackend.onrender.com/api'; // Thay đổi base URL của API của bạn

  constructor(private http: HttpClient) { }

  request<T>(method: string, endpoint: string, data: any = null): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Thêm các headers khác nếu cần
    });

    const url = `${this.baseUrl}/${endpoint}`;

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<T>(url, { headers }).pipe(
          tap(response => {
            // console.log(response);


          }),
          catchError(this.handleError<T>(`GET ${url}`))
        );
      case 'post':
        return this.http.post<T>(url, data, { headers }).pipe(
          tap(response => {
            // console.log(response);

          }),
          catchError(this.handleError<T>(`POST ${url}`))
        );
      case 'put':
        return this.http.put<T>(url, data, { headers }).pipe(
          tap(response => {
            // console.log(response);

          }),
          catchError(this.handleError<T>(`PUT ${url}`))
        );
      case 'delete':
        return this.http.delete<T>(url, { headers }).pipe(
          tap(response => {
            console.log("Delete category successful");

          }),
          catchError(this.handleError<T>(`DELETE ${url}`))
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