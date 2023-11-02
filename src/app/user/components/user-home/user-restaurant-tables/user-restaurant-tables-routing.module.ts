import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRestaurantTablesComponent } from './user-restaurant-tables.component';

const routes: Routes = [
  {
    path: '',
    component: UserRestaurantTablesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRestaurantTablesRoutingModule { }
