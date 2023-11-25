import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserRestaurantTableInfomationComponent } from './user-restaurant-table-infomation/user-restaurant-table-infomation.component';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-restaurant-tables.component.html',
  styleUrls: ['./user-restaurant-tables.component.css']
})
export class UserRestaurantTablesComponent {
  restaurantTables: RestaurantTable[] = [];

  constructor(
    private toastService: ToastService,
    private modalService: NgbModal,
    private restaurantTableService: RestaurantTableService,
    private tableStatusService: TableStatusService,
    private authenticationService: AuthenticationService,
    private tableTypeService: TableTypeService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getRestaurantTables();
  }

  getRestaurantTables(): void {
    this.restaurantTableService.gets()
      .subscribe(restaurantTables => this.restaurantTables = restaurantTables);
  }

  getTableStatusById(tableStatusId: number): Observable<TableStatus | null> {
    return this.tableStatusService.getTableStatusById(tableStatusId);
  }

  getTableTypeById(tableTypeId: number) {
    return this.tableTypeService.getTableTypeById(tableTypeId);
  }

  getRestaurantById(restaurantId: number) {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  openRestaurantTableInfomationModal(restaurantTable: RestaurantTable) {
    if (!this.authenticationService.getUserCache()) {
      //this.toastService.showError("Đặt bàn thất bại mời đăng nhập");
    } else {
      //this.toastService.showSuccess("Đặt bàn thành công");

      const modalRef = this.modalService.open(UserRestaurantTableInfomationComponent, { size: 'lg' });
      modalRef.componentInstance.restaurantTable = restaurantTable;

      // Subscribe to the emitted event
      modalRef.componentInstance.restaurantTableSaved.subscribe(() => {
        this.getRestaurantTables(); // Refresh data in the parent component
      });

    }


  }

}
