import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class StatisticsService {
  constructor(private apiService: ApiService,
    private http: HttpClient) { }

  getStatistics(): Observable<any> {
    const statisticsUrl = 'totalIngredients';
    return this.apiService.request<any>('get', statisticsUrl);
  }

  getIngredientsForMenuItem(menuItemId: number): Observable<any> {
    const url = `${menuItemId}/ingredients`;
    return this.apiService.request<any>('get', url);
  }
  getReservationsByDate(date: string) {
    const url = `by-date?date=${date}`;
    return this.apiService.request<any>('get', url);
  }

  // getTop5MostOrderedItems(): Observable<any[]> {
  //   const url = `top5`;
  //  return this.apiService.request<any>('get', url);
  // }
  getTop5MostOrderedItems() {
    const url = `top5`;
    return this.apiService.request<any>('get', url);
  }
}