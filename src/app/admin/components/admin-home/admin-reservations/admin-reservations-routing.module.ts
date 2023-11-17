import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReservationsComponent } from './admin-reservations.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReservationsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReservationsRoutingModule { }
