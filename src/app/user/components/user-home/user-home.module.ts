import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserHomeRoutingModule } from './user-home-routing.module';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';

@NgModule({
  imports: [
    CommonModule,
    UserHomeRoutingModule
  ],
  declarations: [

  
    UserFavoritesComponent
  ]
})
export class UserHomeModule { }
