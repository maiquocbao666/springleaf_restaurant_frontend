import { Component } from '@angular/core';
import { Order } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-user-order-histories',
  templateUrl: './user-order-histories.component.html',
  styleUrls: ['./user-order-histories.component.css']
})
export class UserOrderHistoriesComponent {

  orders!: Order[];

  constructor(
    private orderService: OrderService,
  ){

  }

  ngOnInit(): void {
    this.orderService.gets().subscribe(
      data => {
        this.orders = data;
      }
    )
  }

}
