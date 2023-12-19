import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoryBranchIngredientDetailComponent } from './admin-inventory-branch-ingredient-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInventoryBranchIngredientDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryBranchIngredientDetailRoutingModule { }
