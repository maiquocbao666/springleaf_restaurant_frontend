import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReceiptDetailComponent } from './admin-receipt-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReceiptDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReceiptDetailRoutingModule { }
