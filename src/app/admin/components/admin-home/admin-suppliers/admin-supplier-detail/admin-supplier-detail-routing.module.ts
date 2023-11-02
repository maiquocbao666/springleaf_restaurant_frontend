import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSupplierDetailComponent } from './admin-supplier-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminSupplierDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSupplierDetailRoutingModule { }
