import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTableTypeDetailComponent } from './admin-table-type-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTableTypeDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTableTypeDetailRoutingModule { }
