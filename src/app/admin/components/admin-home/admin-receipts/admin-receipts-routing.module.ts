import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminReceiptsComponent } from './admin-receipts.component';

const routes: Routes = [
  {
    path: '',
    component: AdminReceiptsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminReceiptsRoutingModule { }
