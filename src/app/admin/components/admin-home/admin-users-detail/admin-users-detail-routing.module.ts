import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersDetailComponent } from './admin-users-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminUsersDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsersDetailRoutingModule { }
