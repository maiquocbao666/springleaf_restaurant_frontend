import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTableTypesComponent } from './admin-table-types.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTableTypesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTableTypesRoutingModule { }
