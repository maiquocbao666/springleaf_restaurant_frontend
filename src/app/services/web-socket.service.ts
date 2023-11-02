import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private subject: Subject<MessageEvent> | undefined;
  private connectionObservable: Observable<MessageEvent> | undefined;

  constructor() { }

  public async connect(url: string): Promise<Observable<MessageEvent>> {
    if (!this.subject || !this.connectionObservable) {
      this.subject = this.createWebSocket(url);
      this.connectionObservable = new Observable<MessageEvent>((observer: Observer<MessageEvent>) => {
        this.subject!.subscribe(observer);
      });
      console.log("Web Socket Connected");
    }
    return this.connectionObservable;
  }

  private createWebSocket(url: string): Subject<MessageEvent> {
    const ws = new WebSocket(url);

    const observable = new Observable<MessageEvent>((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);

      return () => {
        ws.close();
        this.subject = undefined;
      };
    });

    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }

  public send(data: Object): void {
    if (this.subject) {
      const messageEvent = new MessageEvent('message', { data: JSON.stringify(data) });
      this.subject.next(messageEvent);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public isConnected(): boolean {
    return !!this.subject && !this.subject.isStopped;
  }

}
