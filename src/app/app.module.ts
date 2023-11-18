import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';



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

import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { WebSocketService } from './services/web-socket.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgToastModule } from 'ng-angular-popup';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatService } from './services/chat.service';
import { UserBannerComponent } from './user/components/user-home/user-banner/user-banner.component';

import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AdminComboDetailComponent } from './admin/components/admin-home/admin-combos/admin-combo-detail/admin-combo-detail.component';
import { AdminCombosComponent } from './admin/components/admin-home/admin-combos/admin-combos.component';
import { AdminEventDetailComponent } from './admin/components/admin-home/admin-events/admin-event-detail/admin-event-detail.component';
import { AdminEventsComponent } from './admin/components/admin-home/admin-events/admin-events.component';
import { AdminGoodsReceiptDetailComponent } from './admin/components/admin-home/admin-goods-receipts/admin-goods-receipt-detail/admin-goods-receipt-detail.component';
import { AdminGoodsReceiptsComponent } from './admin/components/admin-home/admin-goods-receipts/admin-goods-receipts.component';
import { AdminInventoryBranchDetailComponent } from './admin/components/admin-home/admin-inventory-branches/admin-inventory-branch-detail/admin-inventory-branch-detail.component';
import { AdminInventoryBranchesComponent } from './admin/components/admin-home/admin-inventory-branches/admin-inventory-branches.component';
import { AdminReceiptDetailComponent } from './admin/components/admin-home/admin-receipts/admin-receipt-detail/admin-receipt-detail.component';
import { AdminReceiptsComponent } from './admin/components/admin-home/admin-receipts/admin-receipts.component';
import { AdminReservationsComponent } from './admin/components/admin-home/admin-reservations/admin-reservations.component';
import { AdminRestaurantDetailComponent } from './admin/components/admin-home/admin-restaurants/admin-restaurant-detail/admin-restaurant-detail.component';
import { AdminRestaurantsComponent } from './admin/components/admin-home/admin-restaurants/admin-restaurants.component';
import { AdminTableStatusDetailComponent } from './admin/components/admin-home/admin-table-statuses/admin-table-status-detail/admin-table-status-detail.component';
import { AdminTableStatusesComponent } from './admin/components/admin-home/admin-table-statuses/admin-table-statuses.component';
import { AdminTableTypeDetailComponent } from './admin/components/admin-home/admin-table-types/admin-table-type-detail/admin-table-type-detail.component';
import { AdminTableTypesComponent } from './admin/components/admin-home/admin-table-types/admin-table-types.component';
import { AppComponent } from './app.component';
import { UserCheckoutComponent } from './user/components/user-home/user-checkout/user-checkout.component';
import { UserRestaurantTableInfomationComponent } from './user/components/user-home/user-restaurant-tables/user-restaurant-table-infomation/user-restaurant-table-infomation.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AdminComboDetailsComponent } from './admin/components/admin-home/admin-combo-details/admin-combo-details.component';
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

    ChatComponent,
    LoginComponent,
    DateTimeComponent,
    ProfileComponent,
    UploadFileComponent,

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
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    WebSocketService,
    ChatService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
