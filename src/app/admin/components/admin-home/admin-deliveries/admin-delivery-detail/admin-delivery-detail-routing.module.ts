import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDeliveryDetailComponent } from './admin-delivery-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDeliveryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDeliveryDetailRoutingModule { }
