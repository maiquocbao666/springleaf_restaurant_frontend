import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantAddressComponent } from './restaurant-address.component';

const routes: Routes = [
  {
    path:'',
    component: RestaurantAddressComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantAddressRoutingModule { }
