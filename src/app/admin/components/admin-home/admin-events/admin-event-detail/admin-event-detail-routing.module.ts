import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEventDetailComponent } from './admin-event-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminEventDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminEventDetailRoutingModule { }
