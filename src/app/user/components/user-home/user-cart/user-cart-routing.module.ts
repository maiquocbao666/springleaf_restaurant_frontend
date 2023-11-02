import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCartComponent } from './user-cart.component';

const routes: Routes = [
  {
    path: '',
    component: UserCartComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCartRoutingModule { }
