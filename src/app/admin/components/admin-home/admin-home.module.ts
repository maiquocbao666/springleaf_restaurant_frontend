import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminDeliveryOrderComponent } from './admin-delivery-order/admin-delivery-order.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({

  imports: [
    CommonModule,
    AdminHomeRoutingModule
  ],
  declarations: [
  ],

})
export class AdminHomeModule { }
