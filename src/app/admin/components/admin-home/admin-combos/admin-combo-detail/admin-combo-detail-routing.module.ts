import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComboDetailComponent } from './admin-combo-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComboDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminComboDetailRoutingModule { }
