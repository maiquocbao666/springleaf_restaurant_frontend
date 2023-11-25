import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReservationStatus } from '../interfaces/reservation-status';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservationStatusService {

    private reservationStatusesUrl = 'reservationStatuses';
    private reservationStatusUrl = 'reservationStatus';

    // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
    private reservationStatusesCacheSubject = new BehaviorSubject<ReservationStatus[]>([]);
    reservationStatusesCache$ = this.reservationStatusesCacheSubject.asObservable();

    constructor(private apiService: ApiService) { }

    get reservationStatusesCache(): ReservationStatus[] {
        return this.reservationStatusesCacheSubject.value;
    }

    set reservationStatusesCache(value: ReservationStatus[]) {
        this.reservationStatusesCacheSubject.next(value);
    }

    gets(): Observable<ReservationStatus[]> {
        if (this.reservationStatusesCache) {
            return of(this.reservationStatusesCache);
        }

        const reservationStatusesObservable = this.apiService.request<ReservationStatus[]>('get', this.reservationStatusesUrl);

        reservationStatusesObservable.subscribe(data => {
            this.reservationStatusesCache = data;
        });

        return reservationStatusesObservable;
    }

    getReservationStatusById(id: number): Observable<ReservationStatus | null> {
        if (!id) {
            return of(null);
        }

        if (this.reservationStatusesCache.length === 0) {
            return this.gets().pipe(
                map(reservationStatuses => {
                    const reservationStatusFromCache = reservationStatuses.find(
                        reservationStatus => reservationStatus.reservationStatusId === id
                    );
                    return reservationStatusFromCache || null;
                })
            );
        }

        const reservationStatusFromCache = this.reservationStatusesCache.find(
            reservationStatus => reservationStatus.reservationStatusId === id
        );

        return of(reservationStatusFromCache || null);
    }

    private isReservationStatusNameInCache(name: string, reservationStatusIdToExclude: number | null = null): boolean {
        const isReservationStatusInCache = this.reservationStatusesCache?.some(
          (cache) =>
            cache.reservationStatusName.toLowerCase() === name.toLowerCase() && cache.reservationStatusId !== reservationStatusIdToExclude
        );
    
        if (isReservationStatusInCache) {
          console.log("Danh mục này đã có rồi");
        }
    
        return isReservationStatusInCache || false;
      }

    add(newStatus: ReservationStatus): Observable<ReservationStatus> {
        if (this.reservationStatusesCache.length > 0) {
            if (this.isReservationStatusNameInCache(newStatus.reservationStatusName)) {
                return of();
            }
        }

        return this.apiService.request<ReservationStatus>('post', this.reservationStatusUrl, newStatus).pipe(
            tap((addedStatus: ReservationStatus) => {
                this.reservationStatusesCache = [...this.reservationStatusesCache, addedStatus];
            })
        );
    }

    update(updatedReservationStatus: ReservationStatus): Observable<any> {
        if (this.reservationStatusesCache.length > 0) {
            if (this.isReservationStatusNameInCache(updatedReservationStatus.reservationStatusName)) {
                return of();
            }
        }

        const url = `${this.reservationStatusUrl}`;

        return this.apiService.request('put', url, updatedReservationStatus).pipe(
            tap(() => {
                const updatedStatuses = this.reservationStatusesCache.map(status =>
                    status.reservationStatusId === updatedReservationStatus.reservationStatusId ? updatedReservationStatus : status
                );
                this.reservationStatusesCache = updatedStatuses;
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.reservationStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updatedStatuses = this.reservationStatusesCache.filter(
                    reservationStatus => reservationStatus.reservationStatusId !== id
                );
                this.reservationStatusesCache = updatedStatuses;
            })
        );
    }

    searchReservationStatusesByName(term: string): Observable<ReservationStatus[]> {
        if (!term.trim()) {
            return of([]);
        }

        if (this.reservationStatusesCache.length > 0) {
            const filteredStatuses = this.reservationStatusesCache.filter(reservationStatus =>
                reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase())
            );

            return of(filteredStatuses);
        }

        return this.apiService.request('get', this.reservationStatusesUrl);
    }

    searchReservationStatusByName(term: string): Observable<ReservationStatus | null> {
        if (!term.trim()) {
            return of(null);
        }

        if (this.reservationStatusesCache.length > 0) {
            const filteredStatus = this.reservationStatusesCache.find(reservationStatus =>
                reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase())
            );

            return of(filteredStatus || null);
        }

        return this.apiService.request('get', this.reservationStatusesUrl);
    }

    updateReservationStatusCache(updatedReservationStatus: ReservationStatus): void {
        const index = this.reservationStatusesCache.findIndex(
            reservationStatus => reservationStatus.reservationStatusId === updatedReservationStatus.reservationStatusId
        );

        if (index !== -1) {
            this.reservationStatusesCache[index] = updatedReservationStatus;
        }
    }
}