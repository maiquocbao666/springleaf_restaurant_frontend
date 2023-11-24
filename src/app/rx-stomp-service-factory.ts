import { RxStompService } from './rx-stomp.service';
import { myRxStompConfig, myRxStompConfig2 } from './my-rx-stomp.config';
import { InjectionToken } from '@angular/core';

export const RX_STOMP_INSTANCE_1 = new InjectionToken<RxStompService>('RX_STOMP_INSTANCE_1');
export const RX_STOMP_INSTANCE_2 = new InjectionToken<RxStompService>('RX_STOMP_INSTANCE_2');

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}

export function rxStompServiceFactory2() {
  const rxStomp2 = new RxStompService();
  rxStomp2.configure(myRxStompConfig2);
  rxStomp2.activate();
  return rxStomp2;
}