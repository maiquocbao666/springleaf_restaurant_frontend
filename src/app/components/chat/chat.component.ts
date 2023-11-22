import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RxStompService } from 'src/app/rx-stomp.service';
// import { ChatService, Message } from 'src/app/services/chat.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  receivedMessages: string[] = [];
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService) {

  }

  ngOnInit(): void {

    this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
      console.log('WebSocket Connection State:', state);
    });

    this.topicSubscription.add(
      this.rxStompService
        .watch('/topic/greetings')
        .subscribe((message: Message) => {
          console.log(message);
          this.receivedMessages.push(message.body);
        })
    );
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date()}`;
    this.rxStompService.publish({ destination: '/app/hello', body: JSON.stringify({'name': "bruh"}) });
  }

  // messages: Message[] = []; // Khai báo thuộc tính messages kiểu Message[]
  // newMessage: Message = { user: '', message: '' }; // Khai báo newMessage kiểu Message và khởi tạo

  // constructor(private chatService: ChatService) {
  //   chatService.messages.subscribe(msg => {
  //     console.log("Response from websocket: " + JSON.stringify(msg));
  //     if (msg.user && msg.message) { // Kiểm tra nếu msg chứa cả hai thuộc tính user và message
  //       this.messages.push(msg); // Thêm tin nhắn vào danh sách messages
  //     }
  //   });
  // }

  // sendMsg() {
  //   if (this.newMessage.message.trim() !== '') {
  //     this.chatService.messages.next(this.newMessage);
  //     // Tạo một đối tượng newMessage mới sau khi gửi tin nhắn
  //     this.newMessage = { user: '', message: '' };
  //   }
  // }

}
