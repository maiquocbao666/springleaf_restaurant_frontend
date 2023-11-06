
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';


@Injectable({
    providedIn: 'root'
})
export class EventService {

    private eventsUrl = 'events';
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

    addEvent(newEvent: Event): Observable<Event> {

        return this.apiService.request<Event>('post', this.eventsUrl, newEvent).pipe(

            tap((addedEvent: Event) => {

                this.eventsCache.push(addedEvent);
                localStorage.setItem(this.eventsUrl, JSON.stringify(this.eventsCache));

            })

        );

    }

    updateEvent(updatedEvent: Event): Observable<any> {

        const url = `${this.eventsUrl}/${updatedEvent.eventId}`;

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

}