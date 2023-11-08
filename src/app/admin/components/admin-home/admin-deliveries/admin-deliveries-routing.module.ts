import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDeliveriesComponent } from './admin-deliveries.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDeliveriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDeliveriesRoutingModule { }
