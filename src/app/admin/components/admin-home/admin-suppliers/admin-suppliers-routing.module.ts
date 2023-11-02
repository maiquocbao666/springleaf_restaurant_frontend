import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSuppliersComponent } from './admin-suppliers.component';

const routes: Routes = [
  {
    path: '',
    component: AdminSuppliersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSuppliersRoutingModule { }
