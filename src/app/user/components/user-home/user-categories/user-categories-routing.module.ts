import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCategoriesComponent } from './user-categories.component';

const routes: Routes = [
  {
    path: '',
    component: UserCategoriesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../user-products/user-products.module').then(
            (m) => m.UserProductsModule
          ),
        //component: UserCartComponent
      },
      {
        path: 'category/:id/products',
        loadChildren: () =>
          import('../user-products/user-products.module').then(
            (m) => m.UserProductsModule
          ),
        //component: UserCartComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCategoriesRoutingModule { }
