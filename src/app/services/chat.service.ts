import { Injectable } from '@angular/core';
import { Subject, Observable, map } from 'rxjs';
import { WebSocketService } from './web-socket.service';
import { environment } from '../environments/environment';

export interface Message {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public messages: Subject<Message>;

  constructor(private wsService: WebSocketService) {
    this.messages = new Subject<Message>();

    // Call connectWebSocket() asynchronously to establish the WebSocket connection
    this.connectWebSocket(wsService);
  }

  private async connectWebSocket(wsService: WebSocketService) {
    const connectionObservable = await wsService.connect(environment.CHAT_URL);

    connectionObservable.subscribe(
      (response: MessageEvent): void => {
        const data = JSON.parse(response.data);
        const message: Message = {
          user: data.author,
          message: data.message
        };
        this.messages.next(message);
      }
    );
  }

  public sendMessage(user: string, message: Message): void {
    // Gửi tin nhắn đến WebSocket thông qua WebSocketService
    this.wsService.send(user);
    this.wsService.send(message);
  }

}