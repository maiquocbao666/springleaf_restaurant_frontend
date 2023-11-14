import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGoodsReceiptsComponent } from './admin-goods-receipts.component';

const routes: Routes = [
  {
    path: '',
    component: AdminGoodsReceiptsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminGoodsReceiptsRoutingModule { }
