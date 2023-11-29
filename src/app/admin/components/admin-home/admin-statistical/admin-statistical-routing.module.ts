import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStatisticalComponent } from './admin-statistical.component';

const routes: Routes = [
  {
    path: '',
    component: AdminStatisticalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminStatisticalRoutingModule { }
