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
        path: 'roles',
        loadChildren: () => import('./admin-users/admin-roles/admin-roles.module').then(
          (m) => m.AdminRolesModule
        )
      },
      {
        path: 'userRoles',
        loadChildren: () => import('./admin-users/admin-user-roles/admin-user-roles.module').then(
          (m) => m.AdminUserRolesModule
        )
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
        path: 'product-discounts',
        loadChildren: () =>
          import('./admin-products/admin-product-discount/admin-product-discounts.module').then(
            (m) => m.AdminProductDiscountsModule
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
        path: 'goodsReceipts',
        loadChildren: () =>
          import('./admin-goods-receipts/admin-goods-receipts.module').then(
            (m) => m.AdminGoodsReceiptsModule
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
      ,
      {
        path: 'tableTypes',
        loadChildren: () =>
          import('./admin-table-types/admin-table-types.module').then(
            (m) => m.AdminTableTypesModule
          ),
      },
      {
        path: 'restaurants',
        loadChildren: () =>
          import('./admin-restaurants/admin-restaurants.module').then(
            (m) => m.AdminRestaurantsModule
          ),
      },
      {
        path: 'receipts',
        loadChildren: () =>
          import('./admin-receipts/admin-receipts.module').then(
            (m) => m.AdminReceiptsModule
          ),
      },
      {
        path: 'comboDetails',
        loadChildren: () =>
          import('./admin-combo-details/admin-combo-details.module').then(
            (m) => m.AdminComboDetailsModule
          ),
      }, {
        path: 'reservations',
        loadChildren: () => import('./admin-reservations/admin-reservations.module').then(
          (m) => m.AdminReservationsModule
        )
      },
      {
        path: 'mergeTables',
        loadChildren: () => import('./admin-merge-tables/admin-merge-tables.module').then(
          (m) => m.AdminMergeTablesModule
        )
      },
      {
        path: 'reservationStatuses',
        loadChildren: () => import('./admin-reservation-statuses/admin-reservation-statuses.module').then(
          (m) => m.AdminReservationStatusesModule
        )
      },
      {
        path: 'menuItemIngredients',
        loadChildren: () => import('./admin-menu-item-ingredients/admin-menu-item-ingredients.module').then(
          (m) => m.AdminMenuItemIngredientsModule
        )
      },
      {
        path: 'orderThresholds',
        loadChildren: () => import('./admin-order-thresholds/admin-order-thresholds.module').then(
          (m) => m.AdminOrderThresholdsModule
        )
      },
      {
        path: 'statistical',
        loadChildren: () => import('./admin-statistical/admin-statistical.module').then(
          (m) => m.AdminStatisticalModule
        )
      },
      {
        path: 'bills',
        loadChildren: () => import('./admin-bills/admin-bills.module').then(
          (m) => m.AdminBillsModule
        )
      }
      ,
      {
        path: 'inventoryBranchIngredients',
        loadChildren: () => import('./admin-inventory-branch-ingredients/admin-inventory-branch-ingredient.module').then(
          (m) => m.AdminInventoryBranchIngredientsModule
        )
      }
      ,
      {
        path: 'discounts',
        loadChildren: () => import('./admin-discounts/admin-discounts.module').then(
          (m) => m.AdminDiscountsModule
        )
      },
      {
        path: 'deliveryOrders',
        loadChildren: () => import('./admin-delivery-order/admin-delivery-order.module').then(
          (m) => m.AdminDeliveryOrderModule
        )
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(
          (m) => m.OrdersModule
        )
      },
      {
        path: 'diagram',
        loadChildren: () => import('./admin-restaurant-diagram/admin-restaurant-diagram.module').then(
          (m) => m.AdminRestaurantDiagramModule
        )
      }
    ]
  },

  {
    path: 'admin/product/detail/:id',
    loadChildren: () => import('./admin-products/admin-product-detail/admin-product-detail.module')
      .then(m => m.AdminProductDetailModule)
  }
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
