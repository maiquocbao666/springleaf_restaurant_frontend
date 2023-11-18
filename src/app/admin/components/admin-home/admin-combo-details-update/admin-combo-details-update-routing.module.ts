import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComboDetailsUpdateComponent } from './admin-combo-details-update.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComboDetailsUpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminComboDetailsUpdateRoutingModule { }
