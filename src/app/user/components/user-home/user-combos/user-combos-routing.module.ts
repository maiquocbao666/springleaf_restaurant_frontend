import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCombosComponent } from './user-combos.component';

const routes: Routes = [
  {
    path: '',
    component: UserCombosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCombosRoutingModule { }
