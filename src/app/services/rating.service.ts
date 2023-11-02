import { Restaurant } from '../interfaces/restaurant';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Rating } from '../interfaces/rating';


@Injectable({
    providedIn: 'root'
})
export class RatingService {

    private ratingsUrl = 'restaurants'; // URL to web api, không cần thêm base URL
    ratingsCache!: Rating[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getRatings(): Observable<Rating[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.ratingsCache) {
            return of(this.ratingsCache);
        }

        const ratingsObservable = this.apiService.request<Rating[]>('get', this.ratingsUrl);

        // Cache the categories observable
        ratingsObservable.subscribe(data => {
            this.ratingsCache = data; // Store the fetched data in the cache
        });

        return ratingsObservable;
    }



}