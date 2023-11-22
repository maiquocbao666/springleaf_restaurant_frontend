import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RxStompService } from 'src/app/rx-stomp.service';
// import { ChatService, Message } from 'src/app/services/chat.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Message } from '@stomp/stompjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  receivedMessages: string[] = [];
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;
  channel = 'topic';
  user: User | null = null;

  constructor(
    private rxStompService: RxStompService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {

    this.authService.cachedData$.subscribe((data) => {
      this.user = data;

      console.log("Kết tối web socket")
      this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
        console.log('WebSocket Connection State:', state);
      });
  
      if (this.channel === "queu") {
        this.topicSubscription = this.rxStompService
          .watch(`/${this.channel}/greetings`)
          .subscribe((message: Message) => {
            console.log(message);
            this.receivedMessages.push(message.body);
          });
      } else
        if (this.channel === "topic") {
          this.topicSubscription = this.rxStompService
            .watch(`/${this.channel}/greetings/${this.user?.userId}`)
            .subscribe((message: Message) => {
              console.log(message);
              this.receivedMessages.push(message.body);
            });
        }
    });

  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {

    if(!this.user){
      return;
    }


    if (this.channel === "queu") {
      const message = `Message generated at ${new Date()}`;
      this.rxStompService.publish({ destination: `/app/${this.channel}`, body: JSON.stringify({ 'name': this.user?.fullName, 'userId': this.user?.userId }) });
    } else
      if (this.channel === "topic") {
        const message = `Message generated at ${new Date()}`;
        this.rxStompService.publish({ destination: `/app/${this.channel}/${this.user.userId}`, body: JSON.stringify({ 'name': "bruh", 'userId': 2 }) });
    }

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
