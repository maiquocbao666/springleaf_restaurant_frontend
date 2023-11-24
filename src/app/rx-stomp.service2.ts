import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root',
})
export class RxStompService2 extends RxStomp {
  constructor() {
    super();
  }
}
