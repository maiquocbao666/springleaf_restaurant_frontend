import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OnlineOfflineService {
    private onlineSubject = new Subject<boolean>();

    constructor() {
        this.updateOnlineStatus();
        window.addEventListener('online', () => this.updateOnlineStatus());
        window.addEventListener('offline', () => this.updateOnlineStatus());
    }

    getOnlineStatus() {
        return this.onlineSubject.asObservable();
    }

    private updateOnlineStatus() {
        this.onlineSubject.next(window.navigator.onLine);
    }
}