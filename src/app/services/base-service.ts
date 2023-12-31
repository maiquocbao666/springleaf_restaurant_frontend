import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, map, of, switchMap, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export abstract class BaseService<T> {

    abstract apisUrl: string;
    abstract cacheKey: string;
    abstract apiUrl: string;

    abstract getItemId(item: T): number | string;
    abstract getItemName(item: T): string;
    abstract getObjectName(): string;

    receivedMessages: string[] = [];
    topicSubscription: Subscription | undefined;
    channel = 'public';

    private cacheSubject = new BehaviorSubject<T[]>([]);
    cache$ = this.cacheSubject.asObservable();

    constructor(
        public apiService: ApiService,
        public rxStompService: RxStompService,
        public sweetAlertService: ToastService,
    ) {

        this.initializeCache();

        this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
            //console.log('WebSocket Connection State:', state);
            if (state === 0) {
                if (this.channel === 'public') {
                    this.subscribeToQueue();
                } else if (this.channel === 'private') {
                    // console.log("Subscribe to socket private");
                }
            }
        });
    }

    private initializeCache() {
        const cachedData = localStorage.getItem(this.cacheKey);
        if (cachedData) {
            const cachedArray = JSON.parse(cachedData) as T[];
            this.cache = cachedArray;
        }
    }

    subscribeToQueue() {
        this.topicSubscription = this.rxStompService
            .watch(`/${this.channel}/${this.cacheKey}`)
            .subscribe((message: Message) => {
                //console.log(this.cacheKey);
                //console.log(message.body);
                try {
                    if (message.body) {
                        const messageData = JSON.parse(message.body);
                        if (Array.isArray(messageData.objects)) {
                            this.cache = messageData.objects;
                            localStorage.setItem(this.cacheKey, JSON.stringify(messageData.objects));
                        } else {
                            console.error("Invalid message format. Unexpected 'objects' format.");
                        }
                    } else {
                        console.error('Message body is undefined.');
                    }
                } catch (error) {
                    console.error('Error parsing JSON from message body:', error);
                }
            });
    }

    private onSendMessage(name: string) {
        if (this.channel === 'public') {
            const messageBody = {
                name: name,
                objects: this.cache,
            };
            this.rxStompService.publish({ destination: `/app/${this.channel}`, body: JSON.stringify(messageBody) });
        }
    }

    get cache(): T[] {
        return this.cacheSubject.value;
    }

    set cache(value: T[]) {
        this.cacheSubject.next(value);
        localStorage.setItem(this.cacheKey, JSON.stringify(value));
    }

    add(newObject: T): Observable<T> {
        //this.resetCache();
        return this.apiService.request<T>('post', this.apiUrl, newObject).pipe(
            tap((added: T) => {
                this.cache = [...this.cache, added];
                //localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
                this.onSendMessage(this.cacheKey);
            })
        );
    }

    update(updatedObject: T): Observable<any> {

        const url = `${this.apiUrl}`;
        return this.apiService.request('put', url, updatedObject).pipe(
            tap(() => {
                const updatedObjects = this.cache.map((cache) =>
                    this.getItemId(cache) === this.getItemId(updatedObject) ? updatedObject : cache
                );
                this.cache = updatedObjects;
                //localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
                this.onSendMessage(this.cacheKey);
            })
        );
    }

    delete(id: number | string): Observable<any> {
        //this.resetCache();
        const url = `${this.apiUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updated = this.cache.filter((cache) => this.getItemId(cache) !== id);
                this.cache = updated;
                //localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
                this.onSendMessage(this.cacheKey);
            })
        );
    }

    searchByKeywords(keywords: string, searchField?: keyof T): Observable<T[]> {
        if (!keywords.trim()) {
            return of([]);
        }

        if (this.cache) {
            const filtered = this.cache.filter((cache) => {
                // Nếu có trường tìm kiếm được chỉ định, thì chỉ tìm kiếm trong trường đó
                if (searchField) {
                    const fieldValue = String(cache[searchField]).toLowerCase();
                    return fieldValue.includes(keywords.toLowerCase());
                }

                // Nếu không có trường tìm kiếm được chỉ định, thì tìm kiếm trong tất cả các trường
                for (const key in cache) {
                    if (Object.prototype.hasOwnProperty.call(cache, key)) {
                        const fieldValue = String(cache[key]).toLowerCase();
                        if (fieldValue.includes(keywords.toLowerCase())) {
                            return true; // Nếu tìm thấy từ khóa, trả về true
                        }
                    }
                }
                return false; // Nếu không tìm thấy từ khóa trong bất kỳ trường nào, trả về false
            });

            if (filtered) {
                return of(filtered);
            }
        }

        return of([]);
    }

    sortEntities(entities: T[], field: keyof T, ascending: boolean): Observable<T[]> {
        const sortedEntities = entities.slice().sort((a, b) => {
            let result: number;

            const valueA = a[field] as string | number | boolean;
            const valueB = b[field] as string | number | boolean;

            if (valueA < valueB) {
                result = -1;
            } else if (valueA > valueB) {
                result = 1;
            } else {
                result = 0;
            }

            return ascending ? result : -result; // Reverse the order for descending
        });

        return of(sortedEntities);
    }

}