import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private caches: { [key: string]: BehaviorSubject<any[]> } = {};

    getCache(key: string): Observable<any[]> {
        if (!this.caches[key]) {
            this.caches[key] = new BehaviorSubject<any[]>([]);
        }
        return this.caches[key].asObservable();
    }

    setCache(key: string, value: any[]): void {
        if (!this.caches[key]) {
            this.caches[key] = new BehaviorSubject<any[]>([]);
        }
        this.caches[key].next(value);
    }
    
}
