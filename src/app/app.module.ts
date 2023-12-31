
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { UserCartComponent } from './user/components/user-home/user-cart/user-cart.component';
import { UserCategoriesComponent } from './user/components/user-home/user-categories/user-categories.component';
import { UserComboDetailComponent } from './user/components/user-home/user-combos/user-combo-detail/user-combo-detail.component';
import { UserCombosComponent } from './user/components/user-home/user-combos/user-combos.component';
import { UserEventsComponent } from './user/components/user-home/user-events/user-events.component';
import { UserFooterComponent } from './user/components/user-home/user-footer/user-footer.component';
import { UserHeaderComponent } from './user/components/user-home/user-header/user-header.component';
import { UserHomeComponent } from './user/components/user-home/user-home.component';
import { UserIndexComponent } from './user/components/user-home/user-index/user-index.component';
import { UserInventoryBranchesComponent } from './user/components/user-home/user-inventory-branches/user-inventory-branches.component';
import { UserProductDetailComponent } from './user/components/user-home/user-products/user-product-detail/user-product-detail.component';
import { UserProductsComponent } from './user/components/user-home/user-products/user-products.component';
import { UserRestaurantTablesComponent } from './user/components/user-home/user-restaurant-tables/user-restaurant-tables.component';
import { UserRestaurantsComponent } from './user/components/user-home/user-restaurants/user-restaurants.component';

import { AdminCategoriesComponent } from './admin/components/admin-home/admin-categories/admin-categories.component';
import { AdminCategoryDetailComponent } from './admin/components/admin-home/admin-categories/admin-category-detail/admin-category-detail.component';
import { AdminFooterComponent } from './admin/components/admin-home/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './admin/components/admin-home/admin-header/admin-header.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { AdminIndexComponent } from './admin/components/admin-home/admin-index/admin-index.component';
import { AdminIngredientDetailComponent } from './admin/components/admin-home/admin-ingredients/admin-ingredient-detail/admin-ingredient-detail.component';
import { AdminIngredientsComponent } from './admin/components/admin-home/admin-ingredients/admin-ingredients.component';
import { AdminInventoriesComponent } from './admin/components/admin-home/admin-inventories/admin-inventories.component';
import { AdminInventoryDetailComponent } from './admin/components/admin-home/admin-inventories/admin-inventory-detail/admin-inventory-detail.component';
import { AdminProductDetailComponent } from './admin/components/admin-home/admin-products/admin-product-detail/admin-product-detail.component';
import { AdminProductsComponent } from './admin/components/admin-home/admin-products/admin-products.component';
import { AdminRestaurantTableDetailComponent } from './admin/components/admin-home/admin-restaurant-tables/admin-restaurant-table-detail/admin-restaurant-table-detail.component';
import { AdminRestaurantTablesComponent } from './admin/components/admin-home/admin-restaurant-tables/admin-restaurant-tables.component';
import { AdminSupplierDetailComponent } from './admin/components/admin-home/admin-suppliers/admin-supplier-detail/admin-supplier-detail.component';
import { AdminSuppliersComponent } from './admin/components/admin-home/admin-suppliers/admin-suppliers.component';
import { AdminUsersComponent } from './admin/components/admin-home/admin-users/admin-users.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgToastModule } from 'ng-angular-popup';
import { ChatComponent } from './components/chat/chat.component';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserBannerComponent } from './user/components/user-home/user-banner/user-banner.component';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AdminComboDetailsUpdateComponent } from './admin/components/admin-home/admin-combo-details-update/admin-combo-details-update.component';
import { AdminComboDetailsComponent } from './admin/components/admin-home/admin-combo-details/admin-combo-details.component';
import { AdminComboDetailComponent } from './admin/components/admin-home/admin-combos/admin-combo-detail/admin-combo-detail.component';
import { AdminCombosComponent } from './admin/components/admin-home/admin-combos/admin-combos.component';
import { AdminEventDetailComponent } from './admin/components/admin-home/admin-events/admin-event-detail/admin-event-detail.component';
import { AdminEventsComponent } from './admin/components/admin-home/admin-events/admin-events.component';
import { AdminGoodsReceiptDetailComponent } from './admin/components/admin-home/admin-goods-receipts/admin-goods-receipt-detail/admin-goods-receipt-detail.component';
import { AdminGoodsReceiptsComponent } from './admin/components/admin-home/admin-goods-receipts/admin-goods-receipts.component';
import { AdminInventoryBranchDetailComponent } from './admin/components/admin-home/admin-inventory-branches/admin-inventory-branch-detail/admin-inventory-branch-detail.component';
import { AdminInventoryBranchesComponent } from './admin/components/admin-home/admin-inventory-branches/admin-inventory-branches.component';
import { AdminMenuItemIngredientDetailComponent } from './admin/components/admin-home/admin-menu-item-ingredients/admin-menu-item-ingredient-detail/admin-menu-item-ingredient-detail.component';
import { AdminMenuItemIngredientsComponent } from './admin/components/admin-home/admin-menu-item-ingredients/admin-menu-item-ingredients.component';
import { AdminOrderThresholdDetailComponent } from './admin/components/admin-home/admin-order-thresholds/admin-order-threshold-detail/admin-order-threshold-detail.component';
import { AdminOrderThresholdsComponent } from './admin/components/admin-home/admin-order-thresholds/admin-order-thresholds.component';
import { AdminReceiptDetailComponent } from './admin/components/admin-home/admin-receipts/admin-receipt-detail/admin-receipt-detail.component';
import { AdminReceiptsComponent } from './admin/components/admin-home/admin-receipts/admin-receipts.component';
import { AdminReservationStatusesComponent } from './admin/components/admin-home/admin-reservation-statuses/admin-reservation-statuses.component';
import { AdminReservationsComponent } from './admin/components/admin-home/admin-reservations/admin-reservations.component';
import { AdminRestaurantDetailComponent } from './admin/components/admin-home/admin-restaurants/admin-restaurant-detail/admin-restaurant-detail.component';
import { AdminRestaurantsComponent } from './admin/components/admin-home/admin-restaurants/admin-restaurants.component';
import { AdminStatisticalComponent } from './admin/components/admin-home/admin-statistical/admin-statistical.component';
import { AdminTableStatusDetailComponent } from './admin/components/admin-home/admin-table-statuses/admin-table-status-detail/admin-table-status-detail.component';
import { AdminTableStatusesComponent } from './admin/components/admin-home/admin-table-statuses/admin-table-statuses.component';
import { AdminTableTypeDetailComponent } from './admin/components/admin-home/admin-table-types/admin-table-type-detail/admin-table-type-detail.component';
import { AdminTableTypesComponent } from './admin/components/admin-home/admin-table-types/admin-table-types.component';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UserPasswordComponent } from './components/user-password/user-password.component';
import { rxStompServiceFactory, rxStompServiceFactory2 } from './rx-stomp-service-factory';
import { RxStompService } from './rx-stomp.service';
import { RxStompService2 } from './rx-stomp.service2';
import { UserCheckoutComponent } from './user/components/user-home/user-checkout/user-checkout.component';
import { UserRestaurantTableInfomationComponent } from './user/components/user-home/user-restaurant-tables/user-restaurant-table-infomation/user-restaurant-table-infomation.component';

import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdminBillsComponent } from './admin/components/admin-home/admin-bills/admin-bills.component';
import { AdminDeliveryOrderComponent } from './admin/components/admin-home/admin-delivery-order/admin-delivery-order.component';
import { AdminDiscountDetailComponent } from './admin/components/admin-home/admin-discount-detail/admin-discount-detail.component';
import { AdminDiscountsComponent } from './admin/components/admin-home/admin-discounts/admin-discounts.component';
import { AdminInventoryBranchIngredientDetailComponent } from './admin/components/admin-home/admin-inventory-branch-ingredients/admin-inventory-branch-ingredient-detail/admin-inventory-branch-ingredient-detail.component';
import { AdminInventoryBranchIngredientsComponent } from './admin/components/admin-home/admin-inventory-branch-ingredients/admin-inventory-branch-ingredients.component';
import { AdminMergeTablesComponent } from './admin/components/admin-home/admin-merge-tables/admin-merge-tables.component';
import { AdminUsersDetailComponent } from './admin/components/admin-home/admin-users-detail/admin-users-detail.component';
import { AdminGuardService } from './services/guard-url/admin-guard.service';
import { UserBillHistoriesComponent } from './user/components/user-home/user-bill-histories/user-bill-histories.component';
import { UserFavoritesComponent } from './user/components/user-home/user-favorites/user-favorites.component';
import { UserOrderHistoriesComponent } from './user/components/user-home/user-header/user-order-histories/user-order-histories.component';
import { UserMergeTablesComponent } from './user/components/user-home/user-restaurant-tables/user-merge-tables/user-merge-tables.component';
import { UserReservationHistoriesComponent } from './user/components/user-home/user-restaurant-tables/user-reservation-histories/user-reservation-histories.component';
import { ChooseMenuItemComponent } from './components/choose-menuItem/choose-menuitem.component';
import { EditSeatingComponent } from './user/components/user-home/user-restaurant-tables/user-reservation-histories/edit-seating/edit-seating.component';

@NgModule({
  declarations: [
    AppComponent,

    UserHomeComponent,
    UserCartComponent,
    UserHeaderComponent,
    UserProductsComponent,
    UserProductDetailComponent,
    UserIndexComponent,
    UserFooterComponent,
    UserCategoriesComponent,
    UserCombosComponent,
    UserEventsComponent,
    UserRestaurantTablesComponent,
    UserRestaurantsComponent,
    UserComboDetailComponent,
    UserInventoryBranchesComponent,
    UserBannerComponent,
    UserCheckoutComponent,
    UserRestaurantTableInfomationComponent,
    UserReservationHistoriesComponent,
    UserMergeTablesComponent,
    UserFavoritesComponent,
    UserBillHistoriesComponent,
    UserOrderHistoriesComponent,
    EditSeatingComponent,

    AdminHeaderComponent,
    AdminProductsComponent,
    AdminProductDetailComponent,
    AdminUsersComponent,
    AdminIndexComponent,
    AdminFooterComponent,
    AdminSuppliersComponent,
    AdminIngredientsComponent,
    AdminHomeComponent,
    AdminCategoriesComponent,
    AdminCategoryDetailComponent,
    AdminInventoriesComponent,
    AdminInventoryDetailComponent,
    AdminRestaurantTablesComponent,
    AdminRestaurantTableDetailComponent,
    AdminIngredientDetailComponent,
    AdminSupplierDetailComponent,
    AdminInventoryBranchesComponent,
    AdminInventoryBranchDetailComponent,
    AdminCombosComponent,
    AdminComboDetailComponent,
    AdminGoodsReceiptDetailComponent,
    AdminEventsComponent,
    AdminEventDetailComponent,
    AdminTableStatusesComponent,
    AdminTableStatusDetailComponent,
    AdminTableTypesComponent,
    AdminTableTypeDetailComponent,
    AdminGoodsReceiptsComponent,
    AdminRestaurantDetailComponent,
    AdminRestaurantsComponent,
    AdminReceiptDetailComponent,
    AdminReceiptsComponent,
    AdminReservationsComponent,
    AdminComboDetailsComponent,
    AdminComboDetailsUpdateComponent,
    AdminReservationStatusesComponent,
    AdminMenuItemIngredientsComponent,
    AdminMenuItemIngredientDetailComponent,
    AdminOrderThresholdsComponent,
    AdminOrderThresholdDetailComponent,
    AdminStatisticalComponent,
    AdminBillsComponent,
    AdminUsersDetailComponent,
    AdminMergeTablesComponent,
    AdminInventoryBranchIngredientsComponent,
    AdminInventoryBranchIngredientDetailComponent,
    AdminDiscountsComponent,
    AdminDiscountDetailComponent,
    AdminDeliveryOrderComponent,
    ChatComponent,
    LoginComponent,
    DateTimeComponent,
    ProfileComponent,
    UserPasswordComponent,
    UploadFileComponent,
    ChooseMenuItemComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CommonModule, // Import CommonModule here
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgToastModule,
    NgxChartsModule, // Thêm vào đây
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    MatCheckboxModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,

  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
    {
      provide: RxStompService2,
      useFactory: rxStompServiceFactory2,
    },
    [AdminGuardService],
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
