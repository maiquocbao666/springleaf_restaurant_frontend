import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRestaurantTableDetailComponent } from './admin-restaurant-table-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminRestaurantTableDetailComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRestaurantTableDetailRoutingModule { }
