import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReservationStatus } from '../interfaces/reservation-status';

@Injectable({
    providedIn: 'root'
})
export class ReservationStatusSerivce {

    private statusesUrl = 'reservationStatuses';
    reservationStatusesCache!: ReservationStatus[];
    private statusUrl = 'reservationStatus';

    constructor(private apiService: ApiService) { }


    getReservationStatuses(): Observable<ReservationStatus[]> {

        if (this.reservationStatusesCache) {

            return of(this.reservationStatusesCache);

        }

        const reservationStatusesObservable = this.apiService.request<ReservationStatus[]>('get', this.statusesUrl);

        reservationStatusesObservable.subscribe(data => {

            this.reservationStatusesCache = data;

        });

        return reservationStatusesObservable;

    }

    getReservationStatusById(id: number): Observable<ReservationStatus | null> {

        if (!id) {
            return of(null);
        }

        if (!this.reservationStatusesCache) {

            this.getReservationStatuses();

        }

        const reservationStatusFromCache = this.reservationStatusesCache.find(reservationStatus => reservationStatus.reservationStatusId === id);

        if (reservationStatusFromCache) {

            return of(reservationStatusFromCache);

        } else {

            const url = `${this.statusUrl}/${id}`;
            return this.apiService.request<ReservationStatus>('get', url);

        }

    }


    addReservationStatus(newstatus: ReservationStatus): Observable<ReservationStatus> {

        return this.apiService.request<ReservationStatus>('post', this.statusUrl, newstatus).pipe(

            tap((addedstatus: ReservationStatus) => {

                this.reservationStatusesCache.push(addedstatus);
                localStorage.setItem(this.statusesUrl, JSON.stringify(this.reservationStatusesCache));

            })

        );

    }


    updateReservationStatus(updatedReservationStatus: ReservationStatus): Observable<any> {

        const url = `${this.statusUrl}`;

        return this.apiService.request('put', url, updatedReservationStatus).pipe(

            tap(() => {

                const index = this.reservationStatusesCache!.findIndex(reservationStatus => reservationStatus.reservationStatusId === updatedReservationStatus.reservationStatusId);

                if (index !== -1) {

                    this.reservationStatusesCache![index] = updatedReservationStatus;
                    localStorage.setItem(this.statusesUrl, JSON.stringify(this.reservationStatusesCache));

                }

            })

        );

    }

    deleteReservationStatus(id: number): Observable<any> {

        const url = `${this.statusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.reservationStatusesCache.findIndex(reservationStatus => reservationStatus.reservationStatusId === id);

                if (index !== -1) {

                    this.reservationStatusesCache.splice(index, 1);
                    localStorage.setItem('reservationStatuses', JSON.stringify(this.reservationStatusesCache));

                }

            })
        );

    }

    searchReservationStatusesByName(term: string): Observable<ReservationStatus[]> {

        if (!term.trim()) {

            return of([]);

        }

        if (this.reservationStatusesCache) {

            const filteredStatuses = this.reservationStatusesCache.filter(reservationStatus => {
                return reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase());
            });

            if (filteredStatuses.length > 0) {
                return of(filteredStatuses);
            }

        }

        return this.apiService.request("get", this.statusesUrl).pipe(

            map(response => response as ReservationStatus[]),
            catchError(error => {

                console.error(error);
                return of([]);

            })
        );

    }

    updateReservationStatusCache(updatedReservationStatus: ReservationStatus): void {

        if (this.reservationStatusesCache) {

            const index = this.reservationStatusesCache.findIndex(reservationStatus => reservationStatus.reservationStatusId === updatedReservationStatus.reservationStatusId);

            if (index !== -1) {

                this.reservationStatusesCache[index] = updatedReservationStatus;

            }
        }

    }

}