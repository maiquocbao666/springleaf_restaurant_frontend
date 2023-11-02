import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserBannerComponent } from './user-banner.component';

const routes: Routes = [
  {
    path: '',
    component: UserBannerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserBannerRoutingModule { }
