import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventsUrl = 'events';
  private eventUrl = 'event';

  // Sử dụng BehaviorSubject để giữ giá trị và thông báo thay đổi
  private eventsCacheSubject = new BehaviorSubject<Event[]>([]);
  eventsCache$ = this.eventsCacheSubject.asObservable();

  constructor(private apiService: ApiService) { }

  get eventsCache(): Event[] {
    return this.eventsCacheSubject.value;
  }

  set eventsCache(value: Event[]) {
    this.eventsCacheSubject.next(value);
  }

  gets(): Observable<Event[]> {
    if (this.eventsCache) {
      return of(this.eventsCache);
    }

    const eventsObservable = this.apiService.request<Event[]>('get', this.eventsUrl);

    eventsObservable.subscribe(data => {
      this.eventsCache = data;
    });

    return eventsObservable;
  }

  private isEventNameInCache(name: string, eventIdToExclude: number | null = null): boolean {
    const isEventInCache = this.eventsCache?.some(
      (cache) =>
        cache.eventName.toLowerCase() === name.toLowerCase() && cache.eventId !== eventIdToExclude
    );

    if (isEventInCache) {
      console.log("Danh mục này đã có rồi");
    }

    return isEventInCache || false;
  }

  add(newEvent: Event): Observable<Event> {
    if (this.isEventNameInCache(newEvent.eventName)) {
      // Nếu đã có sự kiện có tên tương tự, trả về Observable với giá trị hiện tại
      return of();
    }

    return this.apiService.request<Event>('post', this.eventUrl, newEvent).pipe(
      tap((addedEvent: Event) => {
        this.eventsCache = [...this.eventsCache, addedEvent];
        localStorage.setItem(this.eventsUrl, JSON.stringify(this.eventsCache));
      })
    );
  }

  update(updatedEvent: Event): Observable<any> {
    if (this.isEventNameInCache(updatedEvent.eventName, updatedEvent.eventId)) {
      // Nếu đã có sự kiện có tên tương tự, trả về Observable với giá trị hiện tại
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

  delete(id: number): Observable<any> {
    if (!id) {
      return of(null);
    }

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