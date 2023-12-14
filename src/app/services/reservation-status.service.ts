import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReservationStatus } from '../interfaces/reservation-status';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';
import { ReservationService } from './reservation.service';
import { Reservation } from '../interfaces/reservation';

@Injectable({
    providedIn: 'root'
})
export class ReservationStatusService extends BaseService<ReservationStatus> {

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    apisUrl: string = 'reservationStatuses';
    cacheKey: string = 'reservationStatuses';
    apiUrl: string = 'reservationStatus';

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService,
        private reservationService: ReservationService,
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    getItemId(item: ReservationStatus): string {
        return item.reservationStatusName!;
    }

    getItemName(item: ReservationStatus): string {
        return item.reservationStatusName!;
    }

    getObjectName(): string {
        return "ReservationStatus";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
    }

    override add(object: ReservationStatus): Observable<ReservationStatus> {
        if (this.isNameInCache(object.reservationStatusName)) {
            this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã có rồi!`, '', 'error', 2000);
            return of();
        }
        return super.add(object);
    }
    override update(object: ReservationStatus): Observable<ReservationStatus> {
        if (this.isNameInCache(object.reservationStatusName)) {
            this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã được sử dụng bên đặt bàn rồi!`, '', 'error', 2000);
            return of();
        }
        return super.update(object);
    }
    override delete(id: string): Observable<any> {
        if (this.isStatusUsedInReservations(id)) {
            this.sweetAlertService.showTimedAlert(`${this.getObjectName()} này đã được sử dụng bên đặt bàn rồi!`, '', 'error', 2000);
            return of();
        };
        return super.delete(id);
    }

    override sortEntities(entities: ReservationStatus[], field: keyof ReservationStatus, ascending: boolean): Observable<ReservationStatus[]> {
        return super.sortEntities(entities, field, ascending);
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Hàm tùy chỉnh

    isNameInCache(name: string, idToExclude: string | null = null): boolean {
        let isInCache = false;
        const cache: ReservationStatus[] = JSON.parse(localStorage.getItem('reservationStatuses') || 'null');

        isInCache = cache.some(
            (item: ReservationStatus) => item.reservationStatusName.toLowerCase() === name.toLowerCase() && item.reservationStatusName !== idToExclude
        );

        return isInCache;
    }

    // tìm coi có reservation nào đang dùng status này không
    isStatusUsedInReservations(id: string): boolean {
        const reservationsString = localStorage.getItem('reservations');
        const reservations: Reservation[] | null = reservationsString ? JSON.parse(reservationsString) : null;
        console.log(reservations);

        if (!reservations) {
            // Handle the case where reservations is null
            return false;
        }

        const isUsed = !!reservations.find((reservation: Reservation) => reservation.reservationStatusName === id);
        return isUsed;
    }

    // searchReservationStatusesByName(term: string): Observable<ReservationStatus[]> {
    //     if (!term.trim()) {
    //         return of([]);
    //     }

    //     if (this.reservationStatusesCache.length > 0) {
    //         const filteredStatuses = this.reservationStatusesCache.filter(reservationStatus =>
    //             reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase())
    //         );

    //         return of(filteredStatuses);
    //     }

    //     return this.apiService.request('get', this.reservationStatusesUrl);
    // }

    // searchReservationStatusByName(term: string): Observable<ReservationStatus | null> {
    //     if (!term.trim()) {
    //         return of(null);
    //     }

    //     if (this.reservationStatusesCache.length > 0) {
    //         const filteredStatus = this.reservationStatusesCache.find(reservationStatus =>
    //             reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase())
    //         );

    //         return of(filteredStatus || null);
    //     }

    //     return this.apiService.request('get', this.reservationStatusesUrl);
    // }

}