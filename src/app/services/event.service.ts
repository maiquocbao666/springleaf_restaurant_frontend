
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Event } from '../interfaces/event';


@Injectable({
    providedIn: 'root'
})
export class EventService {

    private eventsUrl = 'events'; // URL to web api, không cần thêm base URL
    eventsCache!: Event[]; // Cache for categories

    constructor(private apiService: ApiService) { } // Inject ApiService

    // Sử dụng ApiService để gửi yêu cầu GET
    getEvents(): Observable<Event[]> {
        // Kiểm tra nếu có dữ liệu trong cache, trả về dữ liệu đó
        if (this.eventsCache) {
            return of(this.eventsCache);
        }

        const eventsObservable = this.apiService.request<Event[]>('get', this.eventsUrl);

        // Cache the categories observable
        eventsObservable.subscribe(data => {
            this.eventsCache = data; // Store the fetched data in the cache
        });

        return eventsObservable;
    }



}