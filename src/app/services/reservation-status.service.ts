import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReservationStatus } from '../interfaces/reservation-status';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationStatusService extends BaseService<ReservationStatus> {

    apisUrl: string = 'reservationStatuses';
    cacheKey: string = 'reservationStatuses';
    apiUrl: string = 'reservationStatus';

    override getItemId(item: ReservationStatus): string {
        return item.reservationStatusName!;
    }
    override getItemName(item: ReservationStatus): string {
        return item.reservationStatusName!;
    }
    override getObjectName(): string {
        return "ReservationStatus";
    }


    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService
    ) {
        super(apiService, rxStompService, sweetAlertService);
    }


    override gets(): Observable<ReservationStatus[]> {
        return super.gets();
    }
    override add(newStatus: ReservationStatus): Observable<ReservationStatus> {
        return super.add(newStatus);
    }
    override update(updatedReservationStatus: ReservationStatus): Observable<ReservationStatus> {
       return super.update(updatedReservationStatus);
    }
    override delete(id : number | string): Observable<any> {
        return super.delete(id);
      }

    // override getById(id: string | number): Observable<ReservationStatus | null> {
    //     return super.getById(id);
    // }

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

      // private isReservationStatusNameInCache(name: string, reservationStatusIdToExclude: number | null = null): boolean {
    //     const isReservationStatusInCache = this.reservationStatusesCache?.some(
    //       (cache) =>
    //         cache.reservationStatusName.toLowerCase() === name.toLowerCase() && cache.reservationStatusId !== reservationStatusIdToExclude
    //     );
    
    //     if (isReservationStatusInCache) {
    //       console.log("Danh mục này đã có rồi");
    //     }
    
    //     return isReservationStatusInCache || false;
    //   }

}