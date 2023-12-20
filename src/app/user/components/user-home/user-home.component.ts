import { Component, OnInit } from '@angular/core';

declare global {
  interface Window { fbAsyncInit: () => void; }
}

declare const FB: any;

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  ngOnInit() {
    // window.fbAsyncInit = function () {
    //   FB.init({
    //     xfbml: true,
    //     version: 'v18.0'
    //   });
    // };

    // (function (d, s, id) {
    //   var js: HTMLScriptElement, fjs = d.getElementsByTagName(s)[0];
    //   if (d.getElementById(id)) { return; }
    //   js = <HTMLScriptElement>document.createElement(s); // Ép kiểu thành HTMLScriptElement
    //   js.id = id;
    //   js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
    //   if (fjs && fjs.parentNode) {
    //     fjs.parentNode.insertBefore(js, fjs);
    //   }
    // }(document, 'script', 'facebook-jssdk'));

    // var chatbox = document.getElementById('fb-customer-chat');
    // if (chatbox) {
    //   chatbox.setAttribute("page_id", "162516943617657");
    //   chatbox.setAttribute("attribution", "biz_inbox");
    // }
  }
}
