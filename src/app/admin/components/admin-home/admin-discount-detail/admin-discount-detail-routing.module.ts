import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDiscountDetailComponent } from './admin-discount-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDiscountDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDiscountDetailRoutingModule { }
