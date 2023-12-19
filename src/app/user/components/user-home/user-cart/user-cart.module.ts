import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCartRoutingModule } from './user-cart-routing.module';
import { UserOrderHistoriesComponent } from '../user-header/user-order-histories/user-order-histories.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserCartRoutingModule
  ]
})
export class UserCartModule { }
