import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComboDetailsComponent } from './admin-combo-details.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComboDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminComboDetailsRoutingModule { }
