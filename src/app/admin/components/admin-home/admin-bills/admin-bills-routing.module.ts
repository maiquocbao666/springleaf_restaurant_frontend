import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBillsComponent } from './admin-bills.component';

const routes: Routes = [
  {
    path: "",
    component: AdminBillsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBillsRoutingModule { }
