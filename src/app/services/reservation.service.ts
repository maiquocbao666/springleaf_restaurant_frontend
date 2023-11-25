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
            this.reservationsCache = data;
        });

        return reservationsObservable;
    }

    add(newReservation: Reservation): Observable<Reservation> {
        return this.apiService.request<Reservation>('post', 'reservation', newReservation).pipe(
            tap((addedReservation: Reservation) => {
                this.reservationsCache = [...this.reservationsCache, addedReservation];
            })
        );
    }

    update(updatedReservation: Reservation): Observable<any> {
        const url = `${this.reservationUrl}/${updatedReservation.reservationId}`;
        return this.apiService.request('put', url, updatedReservation).pipe(
            tap(() => {
                this.updateCache(updatedReservation);
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.reservationUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedCache = this.reservationsCache.filter(reservation => reservation.reservationId !== id);
                this.reservationsCache = updatedCache;
            })
        );
    }

    getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
        if (this.reservationsCache.length > 0) {
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

    isReservationStatusUsed(reservationStatusId: number): boolean {
        return this.reservationsCache.some(reservation => reservation.reservationStatusId === reservationStatusId);
    }
}