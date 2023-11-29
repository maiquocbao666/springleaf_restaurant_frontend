import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Rating } from '../interfaces/rating';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService extends BaseService<Rating> {

  //--------------------------------------------------------------------------------------------------

  apisUrl = 'ratings';
  cacheKey = 'ratings';
  apiUrl = 'rating';

  //--------------------------------------------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  //--------------------------------------------------------------------------------------------------

  getItemId(item: Rating): number {
    return item.ratingId!;
  }

  getItemName(item: Rating): string {
    throw new Error('Method not implemented.');
  }

  getObjectName(): string {
    return "Rating";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //--------------------------------------------------------------------------------------------------

  override add(newObject: Rating): Observable<Rating> {
    return super.add(newObject);
  }

  override update(updatedObject: Rating): Observable<Rating> {
    return super.update(updatedObject);
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }

  override searchByName(term: string): Observable<Rating[]> {
    return super.searchByName(term);
  }

  //--------------------------------------------------------------------------------------------------

}
