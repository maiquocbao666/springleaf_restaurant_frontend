import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDiscountsComponent } from './admin-discounts.component';

const routes: Routes = [
  
  {
    path: '',
    component: AdminDiscountsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDiscountsRoutingModule { }
