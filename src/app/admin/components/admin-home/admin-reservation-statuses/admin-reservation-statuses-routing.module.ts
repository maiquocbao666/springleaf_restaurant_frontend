import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReservationStatusesComponent } from './admin-reservation-statuses.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReservationStatusesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReservationStatusesRoutingModule { }
