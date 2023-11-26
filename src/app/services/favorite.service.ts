import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Favorite } from './../interfaces/favorite';
import { BehaviorSubject } from 'rxjs';
import { RxStompService } from '../rx-stomp.service';
import { BaseService } from './base-service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService extends BaseService<Favorite> {


  apisUrl = 'favorites';
  cacheKey = 'favorites';
  apiUrl = 'favorite';

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
  }

  override gets(): Observable<Favorite[]> {
    return super.gets();
  }
  override add(newFavorite: Favorite): Observable<Favorite> {
    return super.add(newFavorite);
  }
  override update(updated: Favorite): Observable<Favorite> {
    return super.update(updated);
  }
  override delete(id : number): Observable<any> {
    return super.delete(id);
  }
  override getItemId(item: Favorite): number {
    return item.favoriteId!;
  }
  override getItemName(item: Favorite): string {
    return '';
  }
  override getObjectName(): string {
    return "Favorite";
  }
}