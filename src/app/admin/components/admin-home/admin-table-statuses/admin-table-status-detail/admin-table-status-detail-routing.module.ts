import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTableStatusDetailComponent } from './admin-table-status-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTableStatusDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTableStatusDetailRoutingModule { }
