import { Favorite } from './../interfaces/favorite';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';




@Injectable({
    providedIn: 'root'
})
export class FavoriteService {

    private favoritesUrl = 'favorites';
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



}