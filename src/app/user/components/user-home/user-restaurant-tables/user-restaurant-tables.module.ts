import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRestaurantTablesRoutingModule } from './user-restaurant-tables-routing.module';
import { UserRestaurantTableInfomationComponent } from './user-restaurant-table-infomation/user-restaurant-table-infomation.component';


@NgModule({
  declarations: [
    UserRestaurantTableInfomationComponent
  ],
  imports: [
    CommonModule,
    UserRestaurantTablesRoutingModule
  ]
})
export class UserTablesModule { }
