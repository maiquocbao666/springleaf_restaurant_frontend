
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';


@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private reservationsUrl = 'reservations';
    reservationsCache!: Reservation[] ;

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



}