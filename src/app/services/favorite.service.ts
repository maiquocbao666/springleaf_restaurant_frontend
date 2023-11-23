import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Favorite } from './../interfaces/favorite';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private favoritesUrl = 'favorites';
  private favoriteUrl = 'favorite';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private favoritesCacheSubject = new BehaviorSubject<Favorite[]>([]);
  favoritesCache$ = this.favoritesCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get favoritesCache(): Favorite[] {
    return this.favoritesCacheSubject.value;
  }

  set favoritesCache(value: Favorite[]) {
    this.favoritesCacheSubject.next(value);
  }

  getFavorites(): Observable<Favorite[]> {
    if (this.favoritesCache.length > 0) {
      console.log("Có favorites cache");
      return of(this.favoritesCache);
    }

    const favoritesObservable = this.apiService.request<Favorite[]>('get', this.favoritesUrl);

    favoritesObservable.subscribe(data => {
      this.favoritesCache = data;
    });

    return favoritesObservable;
  }

  private isMenuItemIdInCache(menuItemId: number): boolean {
    return !!this.favoritesCache?.find(favorite => favorite.menuItem === menuItemId);
  }

  addFavorite(newFavorite: Favorite): Observable<Favorite> {
    if (this.isMenuItemIdInCache(newFavorite.menuItem)) {
      return of();
    }

    return this.apiService.request<Favorite>('post', this.favoriteUrl, newFavorite).pipe(
      tap((addedFavorite: Favorite) => {
        this.favoritesCache = [...this.favoritesCache, addedFavorite];
        localStorage.setItem(this.favoritesUrl, JSON.stringify(this.favoritesCache));
      })
    );
  }

  updateFavorite(updatedFavorite: Favorite): Observable<any> {
    if (this.isMenuItemIdInCache(updatedFavorite.menuItem)) {
      return of();
    }

    const url = `${this.favoriteUrl}/${updatedFavorite.favoriteId}`;

    return this.apiService.request('put', url, updatedFavorite).pipe(
      tap(() => {
        const index = this.favoritesCache!.findIndex(favorite => favorite.favoriteId === updatedFavorite.favoriteId);

        if (index !== -1) {
          this.favoritesCache![index] = updatedFavorite;
          localStorage.setItem(this.favoritesUrl, JSON.stringify(this.favoritesCache));
        }
      })
    );
  }

  deleteFavorite(id: number): Observable<any> {
    const url = `${this.favoriteUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        const index = this.favoritesCache.findIndex(favorite => favorite.favoriteId === id);

        if (index !== -1) {
          this.favoritesCache.splice(index, 1);
          localStorage.setItem(this.favoritesUrl, JSON.stringify(this.favoritesCache));
        }
      })
    );
  }

}