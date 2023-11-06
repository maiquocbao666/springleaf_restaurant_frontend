import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Favorite } from './../interfaces/favorite';




@Injectable({
    providedIn: 'root'
})
export class FavoriteService {

    private favoritesUrl = 'favoritesUrl';
    private favoriteUrl = 'favoriteUrl';
    favoritesCache!: Favorite[];

    constructor(private apiService: ApiService) { }


    getFavorites(): Observable<Favorite[]> {

        if (this.favoritesCache) {

            console.log("Có favorites cache");
            return of(this.favoritesCache);

        }

        const favoritesObservable = this.apiService.request<Favorite[]>('get', this.favoritesUrl);


        favoritesObservable.subscribe(data => {

            this.favoritesCache = data;

        });

        return favoritesObservable;

    }

    addFavorite(newFavorite: Favorite): Observable<Favorite> {

        return this.apiService.request<Favorite>('post', this.favoriteUrl, newFavorite).pipe(

            tap((addedFavorite: Favorite) => {

                this.favoritesCache.push(addedFavorite);
                localStorage.setItem(this.favoritesUrl, JSON.stringify(this.favoritesCache));

            })

        );

    }

    updateFavorite(updatedFavorite: Favorite): Observable<any> {

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