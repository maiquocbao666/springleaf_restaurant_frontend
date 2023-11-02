import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCategoryDetailComponent } from './admin-category-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminCategoryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCategoryDetailRoutingModule { }
