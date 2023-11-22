import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';  // Import Subscription
import { RxStompService } from 'src/app/rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  receivedMessages: string[] = [];
  private topicSubscription: Subscription | undefined;  // Use Subscription or undefined
  channel = 'queu';
  user: User | null = null;

  constructor(
    private rxStompService: RxStompService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.authService.cachedData$.subscribe((data) => {
      this.user = data;

      console.log("Kết tối web socket");
      this.topicSubscription = this.rxStompService.connectionState$.subscribe(state => {
        console.log('WebSocket Connection State:', state);

        if (state === 0) {
          if (this.channel === "queu") {
            this.subscribeToQueu();
          } else if (this.channel === "topic") {
            this.subscribeToTopic();
          }
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }

  onSendMessage() {
    if (!this.user) {
      return;
    }

    if (this.channel === "queu") {
      this.rxStompService.publish({ destination: `/app/${this.channel}`, body: JSON.stringify({ 'name': this.user?.fullName, 'userId': this.user?.userId }) });
    } else if (this.channel === "topic") {
      this.rxStompService.publish({ destination: `/app/${this.channel}/${this.user.userId}`, body: JSON.stringify({ 'name': "bruh", 'userId': 2 }) });
    }
  }

  private subscribeToQueu() {
    this.topicSubscription = this.rxStompService
      .watch(`/${this.channel}/greetings`)
      .subscribe((message: Message) => {
        console.log(message);
        this.receivedMessages.push(message.body);
      });
  }

  private subscribeToTopic() {
    if (this.user) {
      this.topicSubscription = this.rxStompService
        .watch(`/${this.channel}/greetings/${this.user.userId}`)
        .subscribe((message: Message) => {
          console.log(message);
          this.receivedMessages.push(message.body);
        });
    }
  }
}