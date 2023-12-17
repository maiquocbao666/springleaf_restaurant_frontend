import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserOrderHistoriesComponent } from './user-order-histories.component';

const routes: Routes = [
  {
    path: '',
    component: UserOrderHistoriesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserOrderHistoriesRoutingModule { }
