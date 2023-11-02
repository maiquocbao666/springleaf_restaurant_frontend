import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInventoryBranchesComponent } from './user-inventory-branches.component';

const routes: Routes = [
    {
      path: '',
      component: UserInventoryBranchesComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInventoryBranchesRoutingModule { }
