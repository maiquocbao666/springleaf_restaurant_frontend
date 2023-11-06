import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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



}