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
            const currentTime = new Date().getTime(); // Lấy thời điểm hiện tại và chuyển đổi thành định dạng yyyy-MM-dd HH:mm:ss
            const filteredReservations = this.cache.filter(reservation => {
                const outTime = new Date(reservation.outTime).getTime(); // Giả sử có trường reservationTime trong model Reservation, bạn cần điều chỉnh tên trường này theo thực tế
                return reservation.restaurantTableId === restaurantTableId && currentTime < outTime;
            });
            return of(filteredReservations);
        }
    
        return of([]);
    }

    getReservationsByUserId(userId: number): Observable<Reservation[]> {
        if (this.cache) {
            const filteredReservations = this.cache.filter(reservation => reservation.userId === userId);
            return of(filteredReservations);
        }

        return of();

    }

    isTimeInRange(startTime: Date, endTime: Date, checkTime: Date): boolean {
        return checkTime.getTime() >= startTime.getTime() && checkTime.getTime() <= endTime.getTime();
    }

    hasReservationInTimeRange(reservations: Reservation[], tableId: number, startTime: Date, endTime: Date): boolean {
        return reservations.some(reservation =>
            reservation.restaurantTableId === tableId &&
            (this.isTimeInRange(new Date(reservation.reservationDate), new Date(reservation.outTime), startTime) ||
            this.isTimeInRange(new Date(reservation.reservationDate), new Date(reservation.outTime), endTime))
        );
    }

    isReservationsInTimeRangeByTableId(tableId: number, startTime: string, endTime: string): boolean {
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);
    
        if (this.cache) {
            const hasReservations = this.hasReservationInTimeRange(this.cache, tableId, startTimeDate, endTimeDate);
            return hasReservations;
        }
    
        // If this.cache is falsy (e.g., undefined), return false
        return false;
    }

    searchReservations(tableId: number, keyword: string): Observable<Reservation[]> {
        if (this.cache) {
            const lowerCaseKeyword = keyword.toLowerCase();
            const filteredReservations = this.cache.filter(reservation =>
                reservation.restaurantTableId === tableId &&
                (reservation.reservationDate.toLowerCase().includes(lowerCaseKeyword) ||
                reservation.outTime.toLowerCase().includes(lowerCaseKeyword))
            );
            return of(filteredReservations);
        }
    
        return of([]);
    }

    order(productList : any[] , reservationId : number){
        const jwtToken = localStorage.getItem('access_token');
    if (!jwtToken) {
      return of(null);
    }
  
    const customHeader = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
    });
        return this.apiService.request<any>('post',`order/${reservationId}`, productList, customHeader);
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