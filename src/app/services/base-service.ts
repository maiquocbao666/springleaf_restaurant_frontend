import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, catchError, map, of, tap } from 'rxjs';
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

    abstract getItemId(item: T): number;
    abstract getItemName(item: T): string;
    abstract getObjectName(): string;

    private receivedMessages: string[] = [];
    private topicSubscription: Subscription | undefined;
    private channel = 'public';

    private cacheSubject = new BehaviorSubject<T[]>([]);
    cache$ = this.cacheSubject.asObservable();

    constructor(
        public apiService: ApiService,
        public rxStompService: RxStompService,
        public sweetAlertService: ToastService,
    ) {
        this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
            console.log('WebSocket Connection State:', state);
            if (state === 0) {
                if (this.channel === 'public') {
                    this.subscribeToQueue();
                } else if (this.channel === 'private') {
                    // console.log("Subscribe to socket private");
                }
            }
        });
    }

    ngOnInit(): void {
        this.gets();
    }

    private subscribeToQueue() {
        this.topicSubscription = this.rxStompService
            .watch(`/${this.channel}/greetings`)
            .subscribe((message: Message) => {
                console.log('Raw message body:', message.body);
                try {
                    const messageData = JSON.parse(message.body);
                    if (Array.isArray(messageData.objects)) {
                        this.cache = messageData.objects;
                        this.gets();
                        localStorage.setItem(messageData.name, JSON.stringify(this.cache));
                    } else {
                        console.error("Invalid message format. Unexpected 'name' or 'objects' format.");
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
    }

    gets(): Observable<T[]> {
        if (this.cache) {
            return of(this.cache);
        }
        const objectsObservable = this.apiService.request<T[]>('get', this.apisUrl);
        objectsObservable.subscribe(data => {
            if (this.cache !== data) {
                this.cache = data;
                return objectsObservable;
            } else {
                return of(this.cache);
            }
        });
        return objectsObservable;
    }

    getById(id: number): Observable<T | null> {
        if (!id) {
            return of(null);
        }
        if (!this.cache.length) {
            this.gets();
        }
        const cacheItem = this.cache.find(item => this.getItemId(item) === id);
        if (cacheItem) {
            return of(cacheItem);
        } else {
            const url = `${this.apiUrl}/${id}`;
            return this.apiService.request<T>('get', url);
        }
    }

    add(newObject: T): Observable<T> {
        return this.apiService.request<T>('post', this.apiUrl, newObject).pipe(
            tap((added: T) => {
                this.cache = [...this.cache, added];
                localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
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
                localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
                this.onSendMessage(this.cacheKey);
            })
        );
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.apiService.request('delete', url).pipe(
            tap(() => {
                const updated = this.cache.filter((cache) => this.getItemId(cache) !== id);
                this.cache = updated;
                localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
                this.onSendMessage(this.cacheKey);
            })
        );
    }

    searchByName(term: string): Observable<T[]> {
        if (!term.trim()) {
            return of([]);
        }

        if (this.cache) {
            const filtered = this.cache.filter((cache) => {
                return this.getItemName(cache).toLowerCase().includes(term.toLowerCase());
            });

            if (filtered) {
                return of(filtered);
            }
        }

        return this.apiService.request('get', this.apisUrl).pipe(
            tap({
                next: (response: any) => {
                    this.cache = response as T[];
                },
                error: (error: any) => {
                    console.error(error);
                },
            }),
            catchError((error: any) => {
                console.error(error);
                return of([]);
            }),
            map((response: any) => response as T[])
        );
    }
}