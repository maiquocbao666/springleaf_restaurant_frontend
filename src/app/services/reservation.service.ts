import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';
import { BaseService } from './base-service';
import { Message } from '@stomp/stompjs';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';
import { HttpHeaders } from '@angular/common/http';
import { Product } from '../interfaces/product';

@Injectable({
    providedIn: 'root'
})
export class ReservationService extends BaseService<Reservation> {

    //--------------------------------------------------------------------------------------------------------------------

    apisUrl: string = 'reservations';
    cacheKey: string = 'reservations';
    apiUrl: string = 'reservation';

    //--------------------------------------------------------------------------------------------------------------------

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService,
    ) {
        super(apiService, rxStompService, sweetAlertService);
        this.subscribeToQueue();
    }

    //--------------------------------------------------------------------------------------------------------------------

    getItemId(item: Reservation): string | number {
        return item.reservationId!;
    }

    getItemName(item: Reservation): string {
        throw new Error('Method not implemented.');
    }

    getObjectName(): string {
        return "Reservation";
    }

    getCache(): Observable<any[]> {
        return this.cache$;
    }

    //--------------------------------------------------------------------------------------------------------------------

    override subscribeToQueue(): void {
        super.subscribeToQueue();
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

    //--------------------------------------------------------------------------------------------------------------------

    getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
        if (this.cache) {
            const filteredReservations = this.cache.filter(reservation => {
                return reservation.restaurantTableId === restaurantTableId;
            });
            return of(filteredReservations);
        }

        return of([]);
    }

    getReservationsByUserId(userId: number): Observable<Reservation[]> {
        return this.cache$.pipe(
            map(cache => {
                if (cache) {
                    const filteredReservations = cache.filter(reservation => reservation.userId === userId);

                    // Sắp xếp danh sách theo trạng thái (Đang đợi lên trên cùng)
                    const statusOrder: { [key: string]: number } = {
                        'Đang đợi': 1,
                        'Đang sử dụng': 2,
                        'Đã sử dụng xong': 3,
                    };

                    filteredReservations.sort((a, b) => statusOrder[a.reservationStatusName] - statusOrder[b.reservationStatusName]);

                    return filteredReservations;
                } else {
                    return [];
                }
            })
        );
    }

    //-------------------------------------------------------------------------------------------------------------------------
    //Kiểm tra xem có bàn nào trong khoảng thời gian trước thời gian đặt của ngày hay không?

    isTimeInDayRange(startTime: Date, checkTime: Date): boolean {
        const startOfDay = new Date(startTime);
        startOfDay.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
        const checkTimeInMillis = checkTime.getTime();
        return checkTimeInMillis >= startOfDay.getTime() && checkTimeInMillis <= startTime.getTime();
    }

    hasReservationInDayRange(reservations: Reservation[], tableId: number, startTime: Date): boolean {
        return reservations.some(reservation =>
            reservation.restaurantTableId === tableId &&
            this.isTimeInDayRange(new Date(reservation.reservationDate), startTime) &&
            (reservation.reservationStatusName === 'Đang sử dụng' || reservation.reservationStatusName === 'Chưa tới' || reservation.reservationStatusName === 'Đang đợi')
        );
    }

    isReservationsInDayRangeByTableId(tableId: number, startTime: string): boolean {
        const startTimeDate = new Date(startTime);

        if (this.cache) {
            const hasReservations = this.hasReservationInDayRange(this.cache, tableId, startTimeDate);
            return hasReservations;
        }

        return false;
    }

    //------------------------------------------------------------------------------------------------------------------

    searchReservations(tableId: number, keyword: string): Observable<Reservation[]> {
        if (this.cache) {
            const lowerCaseKeyword = keyword.toLowerCase();
            const filteredReservations = this.cache.filter(reservation =>
                reservation.restaurantTableId === tableId &&
                (reservation.reservationDate.toLowerCase().includes(lowerCaseKeyword) ||
                    reservation.outTime.toLowerCase().includes(lowerCaseKeyword)) &&
                (reservation.reservationStatusName === 'Đang đợi' || reservation.reservationStatusName === 'Đang sử dụng' || reservation.reservationStatusName === 'Đang tới')
            );
            return of(filteredReservations);
        }

        return of();
    }

    order(productList: any[], reservationId: number) {
        const jwtToken = localStorage.getItem('access_token');
        if (!jwtToken) {
            return of(null);
        }

        const customHeader = new HttpHeaders({
            'Authorization': `Bearer ${jwtToken}`,
        });
        return this.apiService.request<any>('post', `order/${reservationId}`, productList, customHeader);
    }

    getReservationsInUseByUserId(userId: number): Observable<Reservation[]> {
        if (this.cache) {
            const currentTime = new Date().getTime();
            const reservationsInUse = this.cache.filter(reservation =>
                reservation.userId === userId &&
                reservation.reservationStatusName === 'Đang sử dụng' && // Thay 'in_use' bằng giá trị thực tế của trạng thái đang sử dụng
                currentTime >= new Date(reservation.reservationDate).getTime() &&
                currentTime <= new Date(reservation.outTime).getTime()
            );
            return of(reservationsInUse);
        }

        return of([]);
    }

    getAllReservationsInUse(): Observable<Reservation[]> {
        if (this.cache) {
            const currentTime = new Date().getTime();
            const reservationsInUse = this.cache.filter(reservation =>
                reservation.reservationStatusName === 'Đang sử dụng' &&
                currentTime >= new Date(reservation.reservationDate).getTime() &&
                currentTime <= new Date(reservation.outTime).getTime()
            );
            return of(reservationsInUse);
        }

        return of([]);
    }

}