import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminTableStatusesComponent } from './admin-table-statuses/admin-table-statuses.component';


@NgModule({

  imports: [
    CommonModule,
    AdminHomeRoutingModule
  ],

  declarations: [
  
    AdminTableStatusesComponent
  ],

})
export class AdminHomeModule { }
