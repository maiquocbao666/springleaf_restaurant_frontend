import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-restaurant-tables.component.html',
  styleUrls: ['./user-restaurant-tables.component.css']
})
export class UserRestaurantTablesComponent {
  restaurantTables: RestaurantTable[] = [];

  constructor(
    private toastService: ToastService,
    private restaurantTableService: RestaurantTableService,
    private tableStatusService: TableStatusService,
    private authenticationService: AuthenticationService,
    private tableTypeService: TableTypeService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
  }

  ngOnInit(): void {
    this.getRestaurantTables();
  }

  getRestaurantTables(): void {
    this.restaurantTableService.getRestaurantTables()
      .subscribe(restaurantTables => this.restaurantTables = restaurantTables);
  }

  getTableStatusById(tableStatusId: number): Observable<TableStatus> {
    return this.tableStatusService.getTableStatusById(tableStatusId);
  }

  getTableTypeById(tableTypeId: number){
    return this.tableTypeService.getTableTypeById(tableTypeId);
  }

  getRestaurantById(restaurantId: number){
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  bookTable(): void {
    if (this.authenticationService.getUserCache() === null) {
      this.toastService.showError("Đặt bàn thất bại mời đăng nhập");
    } else {
      this.toastService.showSuccess("Đặt bàn thành công");
    }

  }

}
