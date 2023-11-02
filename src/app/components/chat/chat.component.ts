import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService, Message } from 'src/app/services/chat.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  messages: Message[] = []; // Khai báo thuộc tính messages kiểu Message[]
  newMessage: Message = { user: '', message: '' }; // Khai báo newMessage kiểu Message và khởi tạo

  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + JSON.stringify(msg));
      if (msg.user && msg.message) { // Kiểm tra nếu msg chứa cả hai thuộc tính user và message
        this.messages.push(msg); // Thêm tin nhắn vào danh sách messages
      }
    });
  }

  sendMsg() {
    if (this.newMessage.message.trim() !== '') {
      this.chatService.messages.next(this.newMessage);
      // Tạo một đối tượng newMessage mới sau khi gửi tin nhắn
      this.newMessage = { user: '', message: '' };
    }
  }

}
