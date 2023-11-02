import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { UserCartComponent } from './user/components/user-home/user-cart/user-cart.component';
import { UserCategoriesComponent } from './user/components/user-home/user-categories/user-categories.component';
import { UserCombosComponent } from './user/components/user-home/user-combos/user-combos.component';
import { UserEventsComponent } from './user/components/user-home/user-events/user-events.component';
import { UserFooterComponent } from './user/components/user-home/user-footer/user-footer.component';
import { UserHeaderComponent } from './user/components/user-home/user-header/user-header.component';
import { UserHomeComponent } from './user/components/user-home/user-home.component';
import { UserIndexComponent } from './user/components/user-home/user-index/user-index.component';
import { UserProductDetailComponent } from './user/components/user-home/user-products/user-product-detail/user-product-detail.component';
import { UserProductsComponent } from './user/components/user-home/user-products/user-products.component';
import { UserRestaurantTablesComponent } from './user/components/user-home/user-restaurant-tables/user-restaurant-tables.component';
import { UserRestaurantsComponent } from './user/components/user-home/user-restaurants/user-restaurants.component';
import { UserComboDetailComponent } from './user/components/user-home/user-combos/user-combo-detail/user-combo-detail.component';
import { UserInventoryBranchesComponent } from './user/components/user-home/user-inventory-branches/user-inventory-branches.component';

import { AdminFooterComponent } from './admin/components/admin-home/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './admin/components/admin-home/admin-header/admin-header.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { AdminIndexComponent } from './admin/components/admin-home/admin-index/admin-index.component';
import { AdminIngredientsComponent } from './admin/components/admin-home/admin-ingredients/admin-ingredients.component';
import { AdminProductDetailComponent } from './admin/components/admin-home/admin-products/admin-product-detail/admin-product-detail.component';
import { AdminProductsComponent } from './admin/components/admin-home/admin-products/admin-products.component';
import { AdminSuppliersComponent } from './admin/components/admin-home/admin-suppliers/admin-suppliers.component';
import { AdminUsersComponent } from './admin/components/admin-home/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './admin/components/admin-home/admin-categories/admin-categories.component';
import { AdminCategoryDetailComponent } from './admin/components/admin-home/admin-categories/admin-category-detail/admin-category-detail.component';
import { AdminIngredientDetailComponent } from './admin/components/admin-home/admin-ingredients/admin-ingredient-detail/admin-ingredient-detail.component';
import { AdminInventoriesComponent } from './admin/components/admin-home/admin-inventories/admin-inventories.component';
import { AdminInventoryDetailComponent } from './admin/components/admin-home/admin-inventories/admin-inventory-detail/admin-inventory-detail.component';
import { AdminRestaurantTableDetailComponent } from './admin/components/admin-home/admin-restaurant-tables/admin-restaurant-table-detail/admin-restaurant-table-detail.component';
import { AdminRestaurantTablesComponent } from './admin/components/admin-home/admin-restaurant-tables/admin-restaurant-tables.component';
import { AdminSupplierDetailComponent } from './admin/components/admin-home/admin-suppliers/admin-supplier-detail/admin-supplier-detail.component';

import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { WebSocketService } from './services/web-socket.service';

import { ProfileComponent } from './components/profile/profile.component';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { NgToastModule } from 'ng-angular-popup';
import { ChatService } from './services/chat.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserBannerComponent } from './user/components/user-home/user-banner/user-banner.component';


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

    ChatComponent,
    LoginComponent,
    DateTimeComponent,
    ProfileComponent

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
  ],
  providers: [
    WebSocketService,
    ChatService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
