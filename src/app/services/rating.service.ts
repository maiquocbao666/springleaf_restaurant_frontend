import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Rating } from '../interfaces/rating';


@Injectable({
    providedIn: 'root'
})
export class RatingService {

    private ratingsUrl = 'restaurants';
    ratingsCache!: Rating[];

    constructor(private apiService: ApiService) { }

   
    getRatings(): Observable<Rating[]> {
        
        if (this.ratingsCache) {

            return of(this.ratingsCache);
            
        }

        const ratingsObservable = this.apiService.request<Rating[]>('get', this.ratingsUrl);

        
        ratingsObservable.subscribe(data => {

            this.ratingsCache = data;

        });

        return ratingsObservable;
    }

    addRating(newRating: Rating): Observable<Rating> {

        return this.apiService.request<Rating>('post', this.ratingsUrl, newRating).pipe(

            tap((addedRating: Rating) => {

                this.ratingsCache.push(addedRating);
                localStorage.setItem(this.ratingsUrl, JSON.stringify(this.ratingsCache));

            })

        );

    }

    updateRating(updatedRating: Rating): Observable<any> {

        const url = `${this.ratingsUrl}/${updatedRating.ratingId}`;

        return this.apiService.request('put', url, updatedRating).pipe(

            tap(() => {

                const index = this.ratingsCache!.findIndex(rating => rating.ratingId === updatedRating.ratingId);

                if (index !== -1) {

                    this.ratingsCache![index] = updatedRating;
                    localStorage.setItem(this.ratingsUrl, JSON.stringify(this.ratingsCache));

                }

            })

        );

    }

}