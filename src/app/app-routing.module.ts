import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ManagerGuardService } from './services/guard-url/manager-guard.service';

const routes: Routes = [

  { path: '', redirectTo: '/user/index', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./user/components/user-home/user-home.module').then(
        (m) => m.UserHomeModule
      ),
    //component: UserHomeComponent
  },
  { path: 'manager', redirectTo: '/manager/index', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./admin/components/admin-home/admin-home.module').then( // đổi lại thành module của mnaager sau khi cập nhật
        (m) => m.AdminHomeModule
      ),
    // canActivate: [AdminGuardService],
  },
  { path: 'admin', redirectTo: '/admin/index', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./admin/components/admin-home/admin-home.module').then(
        (m) => m.AdminHomeModule // đổi lại thành module của admin sau khi cập nhật
      ),
    // canActivate: [ManagerGuardService],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
