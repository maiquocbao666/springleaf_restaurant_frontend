import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { EditSeatingComponent } from './user-restaurant-tables/user-reservation-histories/edit-seating/edit-seating.component';

@NgModule({
  imports: [
    CommonModule,
    UserHomeRoutingModule
  ],
  declarations: [
  ]
})
export class UserHomeModule { }
