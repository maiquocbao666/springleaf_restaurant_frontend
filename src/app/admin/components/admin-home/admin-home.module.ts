import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminDeliveryOrderComponent } from './admin-delivery-order/admin-delivery-order.component';
import { AdminDeliveryOrderHistoryComponent } from './admin-delivery-order-history/admin-delivery-order-history.component';

@NgModule({

  imports: [
    CommonModule,
    AdminHomeRoutingModule
  ],
  declarations: [
  
  
    AdminDeliveryOrderHistoryComponent
  ],

})
export class AdminHomeModule { }
