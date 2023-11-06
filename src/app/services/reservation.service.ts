
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';


@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private reservationsUrl = 'reservations';
    reservationsCache!: Reservation[];

    constructor(private apiService: ApiService) { }

    getReservations(): Observable<Reservation[]> {

        if (this.reservationsCache) {

            return of(this.reservationsCache);

        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);


        reservationsObservable.subscribe(data => {

            this.reservationsCache = data;

        });

        return reservationsObservable;

    }

    addReservation(newReservation: Reservation): Observable<Reservation> {

        return this.apiService.request<Reservation>('post', this.reservationsUrl, newReservation).pipe(

            tap((addedReservation: Reservation) => {

                this.reservationsCache.push(addedReservation);
                localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));

            })

        );

    }

    updateReservation(updatedReservation: Reservation): Observable<any> {

        const url = `${this.reservationsUrl}/${updatedReservation.reservationId}`;

        return this.apiService.request('put', url, updatedReservation).pipe(

            tap(() => {

                const index = this.reservationsCache!.findIndex(reservation => reservation.reservationId === updatedReservation.reservationId);

                if (index !== -1) {

                    this.reservationsCache![index] = updatedReservation;
                    localStorage.setItem(this.reservationsUrl, JSON.stringify(this.reservationsCache));

                }

            })

        );

    }

}