import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRestaurantsComponent } from './user-restaurants.component';

const routes: Routes = [
  {
    path: '',
    component: UserRestaurantsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRestaurantsRoutingModule { }
