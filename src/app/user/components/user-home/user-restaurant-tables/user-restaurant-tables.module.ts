import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRestaurantTablesRoutingModule } from './user-restaurant-tables-routing.module';
import { UserMergeTablesComponent } from './user-merge-tables/user-merge-tables.component';


@NgModule({
  declarations: [
  
    UserMergeTablesComponent
  ],
  imports: [
    CommonModule,
    UserRestaurantTablesRoutingModule
  ]
})
export class UserTablesModule { }
