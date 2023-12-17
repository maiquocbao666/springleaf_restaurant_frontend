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
import { CartDetail } from '../interfaces/cart-detail';
import { Order } from '../interfaces/order';

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

    getReservedByTableId(restaurantTableId: number): Reservation[] {
        if (this.cache) {
            const filteredReservations = this.cache.filter(reservation => {
                return reservation.restaurantTableId === restaurantTableId && (
                    reservation.reservationStatusName === "Chưa tới" ||
                    reservation.reservationStatusName === "Đang đợi" ||
                    reservation.reservationStatusName === "Đang sử dụng"
                );
            });
            return filteredReservations;
        }

        return [];
    }

    getReservationsByUserId(userId: number): Observable<Reservation[]> {
        return this.cache$.pipe(
            map(cache => {
                if (cache) {
                    const filteredReservations = cache.filter(reservation => reservation.userId === userId);

                    // Sắp xếp danh sách theo trạng thái (Đang đợi lên trên cùng)
                    const statusOrder: { [key: string]: number } = {
                        'Đang đợi': 0,
                        'Chưa tới': 1,
                        'Đang sử dụng': 2,
                        'Hết thời gian đợi': 3,
                        'Đã sử dụng xong': 4,
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

    isTableReserved(tableId: number, fullDateTime: string, selectedDate: string): boolean {
        const findReservation = this.cache.filter(reservation =>
            reservation.restaurantTableId === tableId &&
            (reservation.reservationStatusName === 'Đang sử dụng' ||
                reservation.reservationStatusName === 'Chưa tới' ||
                reservation.reservationStatusName === 'Đang đợi') &&
            this.isSameDate(new Date(reservation.reservationDate), new Date(fullDateTime)) &&
            (new Date(reservation.reservationDate).getTime() < new Date(fullDateTime).getTime())
        );

        //console.log(findReservation);

        if (findReservation.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    isSameDate(date1: Date, date2: Date): boolean {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    //------------------------------------------------------------------------------------------------------------------
    // Kiểm tra xem có bàn nào đặt sau thời gian này hay không
    
    isTableReserved1(tableId: number, fullDateTime: string, selectedDate: string): boolean {
        const findReservation = this.cache.filter(reservation =>
            reservation.restaurantTableId === tableId &&
            (reservation.reservationStatusName === 'Đang sử dụng' ||
                reservation.reservationStatusName === 'Chưa tới' ||
                reservation.reservationStatusName === 'Đang đợi') &&
            this.isSameDate(new Date(reservation.reservationDate), new Date(fullDateTime)) &&
            (new Date(fullDateTime).getTime() < new Date(reservation.reservationDate).getTime())
        );

        console.log(findReservation);

        if (findReservation.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------

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

    order(productList: Product[], cartDetails : CartDetail[], reservationId: number) {
        const jwtToken = sessionStorage.getItem('access_token');
        if (!jwtToken) {
            return of(null);
        }

        const customHeader = new HttpHeaders({
            'Authorization': `Bearer ${jwtToken}`,
        });
        return this.apiService.request<any>('post', `order/${reservationId}`, cartDetails, customHeader);
    }

    getOrderByReservationId(reservationId : number){
        const jwtToken = sessionStorage.getItem('access_token');
        if (!jwtToken) {
            return of(null);
        }

        const customHeader = new HttpHeaders({
            'Authorization': `Bearer ${jwtToken}`,
        });
        return this.apiService.request<any>('post', `getOrderByReservation`, reservationId, customHeader);
    }

    getReservationsInUseByUserId(userId: number): Observable<Reservation[]> {
        if (this.cache) {
            const currentTime = new Date().getTime();
            const reservationsInUse = this.cache.filter(reservation =>
                reservation.userId === userId &&
                reservation.reservationStatusName === 'Đang sử dụng' //&& // Thay 'in_use' bằng giá trị thực tế của trạng thái đang sử dụng
                // currentTime >= new Date(reservation.reservationDate).getTime() &&
                // currentTime <= new Date(reservation.outTime).getTime()
            );
            return of(reservationsInUse);
        }

        return of([]);
    }

    getAllReservationsInUse(): Observable<Reservation[]> {
        if (this.cache) {
            const currentTime = new Date().getTime();
            const reservationsInUse = this.cache.filter(reservation =>
                reservation.reservationStatusName === 'Đang sử dụng' //&&
                // currentTime >= new Date(reservation.reservationDate).getTime() &&
                // currentTime <= new Date(reservation.outTime).getTime()
            );
            return of(reservationsInUse);
        }

        return of([]);
    }

}