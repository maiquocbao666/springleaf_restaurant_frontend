import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Rating } from '../interfaces/rating';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private ratingsUrl = 'ratings';
  private ratingUrl = 'rating';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private ratingsCacheSubject = new BehaviorSubject<Rating[]>([]);
  ratingsCache$ = this.ratingsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get ratingsCache(): Rating[] {
    return this.ratingsCacheSubject.value;
  }

  set ratingsCache(value: Rating[]) {
    this.ratingsCacheSubject.next(value);
  }

  getRatings(): Observable<Rating[]> {
    if (this.ratingsCache.length > 0) {
      return of(this.ratingsCache);
    }

    const ratingsObservable = this.apiService.request<Rating[]>('get', this.ratingsUrl);

    ratingsObservable.subscribe(data => {
      this.ratingsCache = data;
    });

    return ratingsObservable;
  }

  addRating(newRating: Rating): Observable<Rating> {
    return this.apiService.request<Rating>('post', this.ratingUrl, newRating).pipe(
      tap((addedRating: Rating) => {
        this.ratingsCache = [...this.ratingsCache, addedRating];
        localStorage.setItem(this.ratingsUrl, JSON.stringify(this.ratingsCache));
      })
    );
  }

  updateRating(updatedRating: Rating): Observable<any> {
    const url = `${this.ratingUrl}/${updatedRating.ratingId}`;

    return this.apiService.request('put', url, updatedRating).pipe(
      tap(() => {
        this.updateRatingCache(updatedRating);
      })
    );
  }

  deleteRating(id: number): Observable<any> {
    const url = `${this.ratingUrl}/${id}`;

    return this.apiService.request('delete', url).pipe(
      tap(() => {
        this.ratingsCache = this.ratingsCache.filter(rating => rating.ratingId !== id);
        localStorage.setItem(this.ratingsUrl, JSON.stringify(this.ratingsCache));
      })
    );
  }

  updateRatingCache(updatedRating: Rating): void {
    if (this.ratingsCache) {
      const index = this.ratingsCache.findIndex(rating => rating.ratingId === updatedRating.ratingId);

      if (index !== -1) {
        this.ratingsCache[index] = updatedRating;
      }
    }
  }
}