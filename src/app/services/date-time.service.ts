import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    private dateTimeWorker: Worker;
    private currentDateTimeSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

    constructor() {
        this.dateTimeWorker = new Worker(new URL('../workers/date-time.worker', import.meta.url));

        this.dateTimeWorker.postMessage('start');

        this.dateTimeWorker.onmessage = (event) => {
            this.currentDateTimeSubject.next(event.data);
        };
    }

    getCurrentTime(): Observable<Date> {
        return this.currentDateTimeSubject.asObservable();
    }

}