import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserBillHistoriesComponent } from './user-bill-histories.component';

const routes: Routes = [
  {
    path: '',
    component: UserBillHistoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserBillHistoriesRoutingModule { }
