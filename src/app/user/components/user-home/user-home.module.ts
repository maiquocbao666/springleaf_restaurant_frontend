import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';
import { UserBillHistoriesComponent } from './user-bill-histories/user-bill-histories.component';

@NgModule({
  imports: [
    CommonModule,
    UserHomeRoutingModule
  ],
  declarations: [


  ]
})
export class UserHomeModule { }
