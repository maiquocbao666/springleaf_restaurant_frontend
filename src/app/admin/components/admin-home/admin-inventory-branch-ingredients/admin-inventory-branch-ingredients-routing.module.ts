import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoryBranchIngredientsComponent } from './admin-inventory-branch-ingredients.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInventoryBranchIngredientsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryBranchIngredientsRoutingModule { }
