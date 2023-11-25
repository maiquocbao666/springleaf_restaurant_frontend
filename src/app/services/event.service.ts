import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService<Event> {

  apisUrl = 'events';
  cacheKey = 'events';
  apiUrl = 'event';

  override getItemId(item: Event): number {
    return item.eventId!;
  }
  override getItemName(item: Event): string {
    throw new Error('Method not implemented.');
  }
  override getObjectName(): string {
    throw new Error('Method not implemented.');
  }

  override gets(): Observable<Event[]> {
    return super.gets();
  }
  override add(newEvent: Event): Observable<Event> {
    return super.add(newEvent);
  }
  override update(updatedEvent: Event): Observable<Event> {
    return super.update(updatedEvent);
  }
  override delete(id: number): Observable<Event> {
   return super.delete(id);
  }

 

}