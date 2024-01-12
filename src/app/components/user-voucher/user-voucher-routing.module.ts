import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserVoucherComponent } from './user-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: UserVoucherComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserVoucherRoutingModule { }
