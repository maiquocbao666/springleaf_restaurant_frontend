import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMenuItemIngredientDetailComponent } from './admin-menu-item-ingredient-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMenuItemIngredientDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenuItemIngredientDetailRoutingModule { }
