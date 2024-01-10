import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminDeliveryOrderComponent } from './admin-delivery-order/admin-delivery-order.component';
import { OrdersComponent } from './orders/orders.component';
import { AdminRestaurantDiagramComponent } from './admin-restaurant-diagram/admin-restaurant-diagram.component';

@NgModule({

  imports: [
    CommonModule,
    AdminHomeRoutingModule
  ],
  declarations: [
  
    AdminRestaurantDiagramComponent
  ],

})
export class AdminHomeModule { }
