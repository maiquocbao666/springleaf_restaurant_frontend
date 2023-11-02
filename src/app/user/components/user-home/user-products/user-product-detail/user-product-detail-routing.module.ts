import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProductDetailComponent } from './user-product-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UserProductDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProductDetailRoutingModule { }
