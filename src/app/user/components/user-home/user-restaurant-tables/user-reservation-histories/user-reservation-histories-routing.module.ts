import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserReservationHistoriesComponent } from './user-reservation-histories.component';

const routes: Routes = [
  {
    path: '',
    component: UserReservationHistoriesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserReservationHistoriesRoutingModule { }
