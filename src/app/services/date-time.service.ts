import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { RxStompService } from "../rx-stomp.service";
import { AuthenticationService } from "./authentication.service";
import { User } from "../interfaces/user";
import { Message } from '@stomp/stompjs';
import { RxStompService2 } from "../rx-stomp.service2";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    private dateTimeWorker: Worker;
    // private currentDateTimeSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());

    receivedMessages: string[] = [];
    private topicSubscription: Subscription | undefined;  // Use Subscription or undefined
    channel = 'private';
    user: User | null = null;

    private currentDateTimeCacheSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
    currentDateTimeCache$ = this.currentDateTimeCacheSubject.asObservable();

    get currentDateTimeCache(): Date {
        return this.currentDateTimeCacheSubject.value;
    }

    set currentDateTimeCache(value: Date) {
        this.currentDateTimeCacheSubject.next(value);
    }

    constructor(
        private rxStompService2: RxStompService2,
        private authService: AuthenticationService
    ) {

        this.authService.cachedData$.subscribe((data) => {
            this.user = data;
            console.log("Kết tối web socket datetime");
            this.rxStompService2.connectionState$.subscribe(state => {
                console.log('WebSocket Connection State:', state);

                if (state === 0) {
                    if (this.channel === "public") {
                        //console.log("Subscribe to public")
                    } else if (this.channel === "private") {
                        console.log("Subscribe to private");
                        this.subscribeToPrivate();
                    }
                }
            });
        });

        this.dateTimeWorker = new Worker(new URL('../workers/date-time.worker', import.meta.url));

        this.dateTimeWorker.postMessage('start');

        this.dateTimeWorker.onmessage = (event) => {

            //this.currentDateTimeSubject.next(event.data);
            this.onSendMessage("bruh");

        };

    }

    private onSendMessage(name: string) {
        if (!this.user) {
            return;
        }

        if (this.channel === "private") {
            const messageBody = name;
            this.rxStompService2.publish({ destination: `/app/${this.channel}/${this.user.userId}`, body: JSON.stringify(messageBody) });
        }

    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        console.log("Date time service init");
    }

    // getCurrentTime(): Observable<Date> {

    //     return this.currentDateTimeSubject.asObservable();

    // }

    private subscribeToPrivate() {
        this.authService.cachedData$.subscribe((data) => {
            this.user = data;
            this.rxStompService2
                .watch(`/${this.channel}/greetings/${this.user?.userId}`)
                .subscribe((message: Message) => {
                    console.log("Raw message body:", message.body);
                    try {
                        this.currentDateTimeCache = new Date(message.body);
                    } catch (error) {
                        console.error("Error parsing JSON from message body:", error);
                    }
                });
        });
    }

}