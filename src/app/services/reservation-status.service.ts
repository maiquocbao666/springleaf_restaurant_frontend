import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ReservationStatus } from '../interfaces/reservation-status';
import { ReservationService } from './reservation.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationStatusSerivce {

    private reservationStatusesUrl = 'reservationStatuses';
    reservationStatusesCache!: ReservationStatus[];
    private reservationStatusUrl = 'reservationStatus';

    constructor(
        private apiService: ApiService,
        private reservationService: ReservationService,
    ) { }


    getReservationStatuses(): Observable<ReservationStatus[]> {

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

        if (!this.reservationStatusesCache) {

            this.getReservationStatuses();

        }

        const reservationStatusFromCache = this.reservationStatusesCache.find(reservationStatus => reservationStatus.reservationStatusId === id);

        if (reservationStatusFromCache) {

            return of(reservationStatusFromCache);

        } else {

            const url = `${this.reservationStatusUrl}/${id}`;
            return this.apiService.request<ReservationStatus>('get', url);

        }

    }

    private isReservationStatusNameInCache(name: string): boolean {
        const isTrue = !!this.reservationStatusesCache?.find(reservationStatus => reservationStatus.reservationStatusName === name);
        if (isTrue) {
            console.log('Trạng thái bàn này đã tồn tại trong cache.');
            return isTrue;
        } else {
            return isTrue;
        }

    }

    addReservationStatus(newStatus: ReservationStatus): Observable<ReservationStatus> {
        // Kiểm tra xem danh sách reservationStatusesCache đã được tải hay chưa
        if (this.reservationStatusesCache) {
            // Nếu đã có trạng thái cùng tên, trả về Observable với giá trị hiện tại
            if (this.isReservationStatusNameInCache(newStatus.reservationStatusName)) {
                return of();
            }
        }

        // Nếu không có trạng thái cùng tên trong cache, tiếp tục thêm trạng thái mới
        return this.apiService.request<ReservationStatus>('post', this.reservationStatusUrl, newStatus).pipe(
            tap((addedStatus: ReservationStatus) => {
                this.reservationStatusesCache.push(addedStatus);
                localStorage.setItem(this.reservationStatusesUrl, JSON.stringify(this.reservationStatusesCache));
            })
        );
    }


    updateReservationStatus(updatedReservationStatus: ReservationStatus): Observable<any> {

        if (this.isReservationStatusNameInCache(updatedReservationStatus.reservationStatusName)) {
            return of();
        }

        const url = `${this.reservationStatusUrl}`;

        return this.apiService.request('put', url, updatedReservationStatus).pipe(

            tap(() => {

                const index = this.reservationStatusesCache!.findIndex(reservationStatus => reservationStatus.reservationStatusId === updatedReservationStatus.reservationStatusId);

                if (index !== -1) {

                    this.reservationStatusesCache![index] = updatedReservationStatus;
                    localStorage.setItem(this.reservationStatusesUrl, JSON.stringify(this.reservationStatusesCache));

                }

            })

        );

    }

    deleteReservationStatus(id: number): Observable<any> {

        const url = `${this.reservationStatusUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const index = this.reservationStatusesCache.findIndex(reservationStatus => reservationStatus.reservationStatusId === id);

                if (index !== -1) {
                    this.reservationStatusesCache.splice(index, 1);
                    localStorage.setItem(this.reservationStatusesUrl, JSON.stringify(this.reservationStatusesCache));
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

        return this.apiService.request("get", this.reservationStatusesUrl).pipe(

            map(response => response as ReservationStatus[]),
            catchError(error => {

                console.error(error);
                return of([]);

            })
        );

    }

    searchReservationStatusByName(term: string): Observable<ReservationStatus | null> {

        if (!term.trim()) {
            return of(null); // Trả về Observable với giá trị null khi term là rỗng
        }

        if (this.reservationStatusesCache) {
            const filteredStatus = this.reservationStatusesCache.find(reservationStatus => {
                return reservationStatus.reservationStatusName.toLowerCase().includes(term.toLowerCase());
            });

            if (filteredStatus) {
                return of(filteredStatus); // Trả về Observable với giá trị đã lọc nếu tìm thấy kết quả
            }
        }

        return this.apiService.request("get", this.reservationStatusesUrl).pipe(
            map(response => {
                const reservations = response as ReservationStatus[];
                if (reservations.length > 0) {
                    return reservations[0]; // Trả về Observable với một reservationStatus nếu có ít nhất một kết quả từ API
                } else {
                    return null; // Trả về giá trị null nếu không có kết quả từ API
                }
            }),
            catchError(error => {
                console.error(error);
                return of(null); // Trả về giá trị null nếu có lỗi
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