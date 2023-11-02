import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { UserBannerComponent } from './user-banner/user-banner.component';

@NgModule({
  imports: [
    CommonModule,
    UserHomeRoutingModule
  ],
  declarations: [
  ]
})
export class UserHomeModule { }
