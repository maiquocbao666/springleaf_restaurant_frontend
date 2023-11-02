import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInventoriesComponent } from './admin-inventories.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInventoriesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminInventoriesRoutingModule { }
