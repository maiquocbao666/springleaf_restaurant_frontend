import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIndexComponent } from './user-index.component';
import { UserCategoriesComponent } from '../user-categories/user-categories.component';

const routes: Routes = [
  {
    path: '',
    component: UserIndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../user-categories/user-categories.module').then((m) => m.UserCategoriesModule),
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserIndexRoutingModule { }
