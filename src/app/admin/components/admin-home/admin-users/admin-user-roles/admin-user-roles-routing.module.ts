import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUserRolesComponent } from './admin-user-roles.component';

const routes: Routes = [
  {
    path: '',
    component: AdminUserRolesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUserRolesRoutingModule { }
