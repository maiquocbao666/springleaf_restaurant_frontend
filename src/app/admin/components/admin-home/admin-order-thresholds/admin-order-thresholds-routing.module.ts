import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOrderThresholdsComponent } from './admin-order-thresholds.component';

const routes: Routes = [
  {
    path: '',
    component: AdminOrderThresholdsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrderThresholdsRoutingModule { }
