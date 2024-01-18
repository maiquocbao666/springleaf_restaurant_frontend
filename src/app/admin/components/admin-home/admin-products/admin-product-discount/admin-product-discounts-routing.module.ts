import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminProductDiscountsComponent } from './admin-product-discounts.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProductDiscountsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProductDiscountsRoutingModule { }
