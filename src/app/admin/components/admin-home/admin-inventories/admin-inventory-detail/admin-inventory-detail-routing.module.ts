import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoryDetailComponent } from './admin-inventory-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInventoryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoryDetailRoutingModule { }
