import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComboDetailComponent } from './user-combo-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UserComboDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserComboDetailRoutingModule { }
