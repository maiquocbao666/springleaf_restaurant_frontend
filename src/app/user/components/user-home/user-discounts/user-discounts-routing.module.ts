import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDiscountsComponent } from './user-discounts.component';

const routes: Routes = [
  {
    path: '',
    component: UserDiscountsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDiscountsRoutingModule { }
