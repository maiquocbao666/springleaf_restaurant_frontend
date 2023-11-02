import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminIngredientDetailComponent } from './admin-ingredient-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminIngredientDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminIngredientDetailRoutingModule { }
