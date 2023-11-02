
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';


@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    private reservationsUrl = 'reservations'; // URL to web api, không cần thêm base URL
    reservationsCache!: Reservation[] ; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getReservations(): Observable<Reservation[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.reservationsCache) {
            return of(this.reservationsCache);
        }

        const reservationsObservable = this.apiService.request<Reservation[]>('get', this.reservationsUrl);

        // Cache the categories observable
        reservationsObservable.subscribe(data => {
            this.reservationsCache = data; // Store the fetched data in the cache
        });

        return reservationsObservable;
    }



}