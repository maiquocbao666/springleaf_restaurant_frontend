import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMergeTablesComponent } from './user-merge-tables.component';

const routes: Routes = [
  {
    path: '',
    component: UserMergeTablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserMergeTablesRoutingModule { }
