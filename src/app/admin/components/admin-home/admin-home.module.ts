import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminMenuItemIngredientsComponent } from './admin-menu-item-ingredients/admin-menu-item-ingredients.component';
import { AdminMenuItemIngredientDetailComponent } from './admin-menu-item-ingredient-detail/admin-menu-item-ingredient-detail.component';

@NgModule({

  imports: [
    CommonModule,
    AdminHomeRoutingModule
  ],
  declarations: [
  ],

})
export class AdminHomeModule { }
