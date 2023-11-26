import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private reservationsUrl = 'reservations';
    private reservationUrl = 'reservation';
    private reservationsCacheSubject = new BehaviorSubject<Reservation[]>([]);
    reservationsCache$ = this.reservationsCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get reservationsCache(): Reservation[] {
        return this.reservationsCacheSubject.value;
    }

    set reservationsCache(value: Reservation[]) {
        this.reservationsCacheSubject.next(value);
    }

    private updateCache(updatedReservation: Reservation): void {
        const index = this.reservationsCache.findIndex(reservation => reservation.reservationId === updatedReservation.reservationId);
        if (index !== -1) {
            const updatedCache = [...this.reservationsCache];
            updatedCache[index] = updatedReservation;
            this.reservationsCache = updatedCache;
        }
    }

    gets(): Observable<Reservation[]> {

        if (this.reservationsCache) {
            return of(this.reservationsCache);
        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);

        reservationsObservable.subscribe(data => {

            if (this.reservationsCache !== data) {
                this.reservationsCache = data;
                return reservationsObservable;
            } else {
                return of(this.reservationsCache);
            }

        });

        return reservationsObservable;
    }

    add(newReservation: Reservation): Observable<Reservation> {
        // Kiểm tra xem danh sách reservationsCache đã được tải hay chưa
        // if (this.reservationsCache) {

        //   // Nếu đã có danh mục cùng tên, trả về Observable với giá trị hiện tại
        //   if (this.isInCache(newReservation.name)) {
        //     return of();
        //   }
        // }

        // Nếu không có danh mục cùng tên trong cache, tiếp tục thêm danh mục mới
        return this.apiService.request<Reservation>('post', this.reservationUrl, newReservation).pipe(
            tap((addedReservation: Reservation) => {
                this.reservationsCache = [...this.reservationsCache, addedReservation];
                localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));
            })
        );
    }

    update(updated: Reservation): Observable<any> {
        // if (this.reservationsCache) {
        //   // Kiểm tra xem danh sách reservationsCache đã được tải hay chưa
        //   if (this.isInCache(updated.name, updated.ReservationId)) {
        //     return of();
        //   }
        // }

        const url = `${this.reservationUrl}`;

        return this.apiService.request('put', url, updated).pipe(
            tap(() => {
                const updatedreservations = this.reservationsCache.map((cache) =>
                    cache.reservationId === updated.reservationId ? updated : cache
                );
                this.reservationsCache = updatedreservations;
                localStorage.setItem(this.reservationsUrl, JSON.stringify(updatedreservations));
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.reservationUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                // Xóa category khỏi reservationsCache
                const updatedreservations = this.reservationsCache.filter(cache => cache.reservationId !== id);
                this.reservationsCache = updatedreservations;
                localStorage.setItem(this.reservationsUrl, JSON.stringify(updatedreservations));
            })
        );
    }

    getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
        if (this.reservationsCache) {
            const filteredReservations = this.reservationsCache.filter(reservation => reservation.restaurantTableId === restaurantTableId);
            return of(filteredReservations);
        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);

        return reservationsObservable.pipe(
            tap(reservations => {
                this.reservationsCache = reservations;
            }),
            map(reservations => reservations.filter(reservation => reservation.restaurantTableId === restaurantTableId))
        );
    }

    isReservationStatusUsed(reservationStatusName: string): boolean {
        return this.reservationsCache.some(reservation => reservation.reservationStatusName === reservationStatusName);
    }

}