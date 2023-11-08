import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoryBranchDetailComponent } from './admin-inventory-branch-detail.component';

const routes: Routes = [
  {
    path: "",
    component: AdminInventoryBranchDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryBranchDetailRoutingModule { }
