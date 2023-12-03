import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../interfaces/bill';
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

  getTop5MostOrderedItems() {
    const url = `top5`;
    return this.apiService.request<any>('get', url);
  }

  getRevenueByTimeRange(startDate: string, endDate: string): Observable<Object[]> {
    const url = `revenue?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.request<Object[]>('get', url);
  }

  getBillsByTimeRange(startDate: string, endDate: string): Observable<Bill[]> {
    const url = `billTimeRange?startDate=${startDate}&endDate=${endDate}`;
    return this.apiService.request<Bill[]>('get', url);
  }

  // getTotalAmount(){
  //   const url = `totalRevenue`;
  //   return this.apiService.request<any>('get', url);
  // }

  getTotalRevenue(): Observable<number> {
    const url = `totalRevenue`;
    return this.apiService.request<number>('get', url);
  }
}