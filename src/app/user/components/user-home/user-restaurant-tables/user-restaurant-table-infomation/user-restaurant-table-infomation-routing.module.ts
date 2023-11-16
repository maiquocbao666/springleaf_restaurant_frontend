import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as path from 'path';
import { UserRestaurantTableInfomationComponent } from './user-restaurant-table-infomation.component';

const routes: Routes = [
  {
    path: '',
    component: UserRestaurantTableInfomationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRestaurantTableInfomationRoutingModule { }
