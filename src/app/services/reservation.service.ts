import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root'
})
export class ReservationService extends BaseService<Reservation> {

    apisUrl: string = 'reservations';
    cacheKey: string = 'reservations';
    apiUrl: string = 'reservation';

    override getItemId(item: Reservation): string | number {
        return item.reservationId!;
    }
    override getItemName(item: Reservation): string {
        throw new Error('Method not implemented.');
    }
    override getObjectName(): string {
        return "Reservation";
    }

    override gets(): Observable<Reservation[]> {
        return super.gets();
    }
    override add(newReservation: Reservation): Observable<Reservation> {
       return super.add(newReservation);
    }
    override update(updated: Reservation): Observable<any> {
        return super.update(updated);
    }
    override delete(id: number): Observable<any> {
        return super.delete(id);
    }

    // getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
    //     if (this.cache) {
    //         const filteredReservations = this.cache.filter(reservation => reservation.restaurantTableId === restaurantTableId);
    //         return of(filteredReservations);
    //     }

    //     const reservationsObservable = this.apiService.request<Reservation[]>('get', this.apisUrl);

    //     return reservationsObservable.pipe(
    //         tap(reservations => {
    //             this.cache = reservations;
    //         }),
    //         map(reservations => reservations.filter(reservation => reservation.restaurantTableId === restaurantTableId))
    //     );
    // }

}