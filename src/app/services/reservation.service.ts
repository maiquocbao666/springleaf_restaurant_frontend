import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Reservation } from '../interfaces/reservation';
import { BaseService } from './base-service';
import { Message } from '@stomp/stompjs';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationService extends BaseService<Reservation> {

    apisUrl: string = 'reservations';
    cacheKey: string = 'reservations';
    apiUrl: string = 'reservation';

    override receivedMessages: string[] = [];
    override topicSubscription: Subscription | undefined;
    override channel = 'public';

    constructor(
        apiService: ApiService,
        rxStompService: RxStompService,
        sweetAlertService: ToastService,
    ) {
        super(apiService, rxStompService, sweetAlertService);
        // this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
        //     console.log('WebSocket Connection State:', state);
        //     if (state === 0) {
        //         if (this.channel === 'public') {
        //             this.subscribeToQueue1();
        //         } else if (this.channel === 'private') {
        //             // console.log("Subscribe to socket private");
        //         }
        //     }
        // });
    }

    // subscribeToQueue1() {
    //     this.topicSubscription = this.rxStompService
    //         .watch(`/${this.channel}/reservations`)
    //         .subscribe((message: Message) => {
    //             try {
    //                 if (message.body) {
    //                     console.log(message.body);
    //                     localStorage.setItem("reservations", JSON.stringify(Array.isArray(message.body) ? message.body : []));
    //                 } else {
    //                     console.error('Message body is undefined.');
    //                 }
    //             } catch (error) {
    //                 console.error('Error parsing JSON from message body:', error);
    //             }
    //         });
    // }

    override getItemId(item: Reservation): string | number {
        return item.reservationId!;
    }
    override getItemName(item: Reservation): string {
        throw new Error('Method not implemented.');
    }
    override getObjectName(): string {
        return "Reservation";
    }

    override gets(): Observable<Reservation[]> {
        return super.gets();
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

    // getReservationsByTableId(restaurantTableId: number): Observable<Reservation[]> {
    //     if (this.cache) {
    //         const filteredReservations = this.cache.filter(reservation => reservation.restaurantTableId === restaurantTableId);
    //         return of(filteredReservations);
    //     }

    //     const reservationsObservable = this.apiService.request<Reservation[]>('get', this.apisUrl);

    //     return reservationsObservable.pipe(
    //         tap(reservations => {
    //             this.cache = reservations;
    //         }),
    //         map(reservations => reservations.filter(reservation => reservation.restaurantTableId === restaurantTableId))
    //     );
    // }

}