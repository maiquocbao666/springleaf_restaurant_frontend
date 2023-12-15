import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMergeTablesComponent } from './admin-merge-tables.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMergeTablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMergeTablesRoutingModule { }
