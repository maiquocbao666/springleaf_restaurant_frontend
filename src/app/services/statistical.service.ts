import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class StatisticsService {
  constructor(private apiService: ApiService) { }

  getStatistics(): Observable<any> {
    const statisticsUrl = 'totalIngredients';
    return this.apiService.request<any>('get', statisticsUrl);
  }

  getIngredientsForMenuItem(menuItemId: number): Observable<any> {
    const url = `${menuItemId}/ingredients`;
    return this.apiService.request<any>('get', url);
  }
}