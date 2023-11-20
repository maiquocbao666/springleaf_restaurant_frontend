
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';


@Injectable({
    providedIn: 'root'
})
export class EventService {

    private eventsUrl = 'events';
    private eventUrl = 'event';
    eventsCache!: Event[];

    constructor(private apiService: ApiService) { }

    getEvents(): Observable<Event[]> {

        if (this.eventsCache) {
            return of(this.eventsCache);
        }

        const eventsObservable = this.apiService.request<Event[]>('get', this.eventsUrl);


        eventsObservable.subscribe(data => {
            this.eventsCache = data;
        });

        return eventsObservable;

    }

    private isEventNameInCache(name: string): boolean {
        const isTrue = !!this.eventsCache?.find(event => event.eventName.toLowerCase() === name.toLowerCase());
        if(isTrue){
            console.log('Tiệc này đã tồn tại trong cache.');
            return isTrue;
        }else {
            return isTrue
        }
    }

    addEvent(newEvent: Event): Observable<Event> {

        if (this.isEventNameInCache(newEvent.eventName)) {
            // Nếu đã có combo có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        return this.apiService.request<Event>('post', this.eventUrl, newEvent).pipe(

            tap((addedEvent: Event) => {

                this.eventsCache.push(addedEvent);
                localStorage.setItem(this.eventsUrl, JSON.stringify(this.eventsCache));

            })

        );

    }

    updateEvent(updatedEvent: Event): Observable<any> {

        if (this.isEventNameInCache(updatedEvent.eventName)) {
            // Nếu đã có combo có tên tương tự, trả về Observable với giá trị hiện tại
            return of();
        }

        const url = `${this.eventUrl}/${updatedEvent.eventId}`;

        return this.apiService.request('put', url, updatedEvent).pipe(

            tap(() => {

                const index = this.eventsCache!.findIndex(event => event.eventId === updatedEvent.eventId);

                if (index !== -1) {

                    this.eventsCache![index] = updatedEvent;
                    localStorage.setItem(this.eventsUrl, JSON.stringify(this.eventsCache));

                }

            })

        );

    }

    deleteEvent(id: number): Observable<any> {

        const url = `${this.eventUrl}/${id}`;

        return this.apiService.request('delete', url).pipe(

            tap(() => {

                const index = this.eventsCache.findIndex(event => event.eventId === id);

                if (index !== -1) {

                    this.eventsCache.splice(index, 1);
                    localStorage.setItem(this.eventsUrl, JSON.stringify(this.eventsCache));

                }

            })
        );

    }


    updateEventCache(updatedEvent: Event): void {

        if (this.eventsCache) {

            const index = this.eventsCache.findIndex(event => event.eventId === updatedEvent.eventId);

            if (index !== -1) {

                this.eventsCache[index] = updatedEvent;

            }
        }

    }

}