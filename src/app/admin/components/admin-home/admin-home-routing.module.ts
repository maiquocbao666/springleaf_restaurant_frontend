import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home.component';

const routes: Routes = [

  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      {
        path: 'index',
        loadChildren: () =>
          import('./admin-index/admin-index.module').then(
            (m) => m.AdminIndexModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./admin-categories/admin-categories.module').then(
            (m) => m.AdminCategoriesModule
          ),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./admin-users/admin-users.module').then(
            (m) => m.AdminUsersModule
          ),
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./admin-suppliers/admin-suppliers.module').then(
            (m) => m.AdminSuppliersModule
          ),
      },
      {
        path: 'ingredients',
        loadChildren: () =>
          import('./admin-ingredients/admin-ingredients.module').then(
            (m) => m.AdminIngredientsModule
          ),
      },
      {
        path: 'inventories',
        loadChildren: () =>
          import('./admin-inventories/admin-inventories.module').then(
            (m) => m.AdminInventoriesModule
          ),
      },
      {
        path: 'restaurantTables',
        loadChildren: () =>
          import('./admin-restaurant-tables/admin-restaurant-tables.module').then(
            (m) => m.AdminRestaurantTablesModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./admin-products/admin-products.module').then(
            (m) => m.AdminProductsModule
          ),
      },
      {
        path: 'tableStatuses',
        loadChildren: () =>
          import('./admin-table-statuses/admin-table-statuses.module').then(
            (m) => m.AdminTableStatusesModule
          ),
      }
      ,
      {
        path: 'inventoryBranches',
        loadChildren: () =>
          import('./admin-inventory-branches/admin-inventory-branches.module').then(
            (m) => m.AdminInventoryBranchesModule
          ),
      }
      ,
      {
        path: 'combos',
        loadChildren: () =>
          import('./admin-combos/admin-combos.module').then(
            (m) => m.AdminCombosModule
          ),
      }
      ,
      {
        path: 'deliveries',
        loadChildren: () =>
          import('./admin-deliveries/admin-deliveries.module').then(
            (m) => m.AdminDeliveriesModule
          ),
      }
      ,
      {
        path: 'events',
        loadChildren: () =>
          import('./admin-events/admin-events.module').then(
            (m) => m.AdminEventsModule
          ),
      }
    ]
  },
  {
    path: 'admin/product/detail/:id',
    loadChildren: () => import('./admin-products/admin-product-detail/admin-product-detail.module')
      .then(m => m.AdminProductDetailModule)
  },
  // {
  //   path: 'admin/category/:id',
  //   loadChildren: () => import('./admin-category-detail/admin-category-detail.module')
  //     .then(m => m.AdminCategoryDetailModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminHomeRoutingModule { }
