import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRestaurantTablesComponent } from './admin-restaurant-tables.component';

const routes: Routes = [
  {
    path: '',
    component: AdminRestaurantTablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRestaurantTablesRoutingModule { }
