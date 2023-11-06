import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTableStatusesComponent } from './admin-table-statuses.component';

const routes: Routes = [
  {
    path: "",
    component: AdminTableStatusesComponent,
    title: "Admin Table Statuses",
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTableStatusesRoutingModule { }
