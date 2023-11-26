import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMenuItemIngredientsComponent } from './admin-menu-item-ingredients.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMenuItemIngredientsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenuItemIngredientsRoutingModule { }
