import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoryBranchesComponent } from './admin-inventory-branches.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInventoryBranchesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryBranchesRoutingModule { }
