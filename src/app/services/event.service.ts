import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';
import { RxStompService } from '../rx-stomp.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<Event> {

  apisUrl = 'events';
  cacheKey = 'events';
  apiUrl = 'event';

  //-----------------------------------------------------------------

  constructor(
    apiService: ApiService,
    rxStompService: RxStompService,
    sweetAlertService: ToastService
  ) {
    super(apiService, rxStompService, sweetAlertService);
    this.subscribeToQueue();
  }

  //-----------------------------------------------------------------

  override subscribeToQueue(): void {
    super.subscribeToQueue();
  }

  getItemId(item: Event): number {
    return item.eventId!;
  }

  getItemName(item: Event): string {
    return item.eventName;
  }

  getObjectName(): string {
    return "Event";
  }

  getCache(): Observable<any[]> {
    return this.cache$;
  }

  //-----------------------------------------------------------------

  override add(newEvent: Event): Observable<Event> {
    return super.add(newEvent);
  }

  override update(updatedEvent: Event): Observable<Event> {
    return super.update(updatedEvent);
  }

  override delete(id : number): Observable<any> {
    return super.delete(id);
  }

  override sortEntities(entities: Event[], field: keyof Event, ascending: boolean): Observable<Event[]> {
    return super.sortEntities(entities, field, ascending);
  }

  //-----------------------------------------------------------------

  

  //-----------------------------------------------------------------

}