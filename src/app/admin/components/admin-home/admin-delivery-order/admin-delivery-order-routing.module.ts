import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDeliveryOrderComponent } from './admin-delivery-order.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDeliveryOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDeliveryOrderRoutingModule { }
