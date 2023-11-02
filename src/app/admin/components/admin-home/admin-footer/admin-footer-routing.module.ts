import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminFooterComponent } from './admin-footer.component';

const routes: Routes = [
  {
    path: '',
    component: AdminFooterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminFooterRoutingModule { }
