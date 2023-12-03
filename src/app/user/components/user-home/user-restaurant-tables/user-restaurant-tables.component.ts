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
import { TableType } from 'src/app/interfaces/table-type';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { UserReservationHistoriesComponent } from './user-reservation-histories/user-reservation-histories.component';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-restaurant-tables.component.html',
  styleUrls: ['./user-restaurant-tables.component.css']
})
export class UserRestaurantTablesComponent {
  restaurantTables: RestaurantTable[] = [];
  restaurantTablesUrl = 'restaurantTables';

  tableStatuses: TableStatus[] = [];
  tableTypes: TableType[] = [];
  restaurants: Restaurant[] = [];
  

  constructor(
    private toastService: ToastService,
    private modalService: NgbModal,
    private modalService2: NgbModal,
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
    this.restaurantTableService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurantTables = cached;
      }
    );
  }

  getTableStatusById(id: number): TableStatus | null {
    const found = this.tableStatuses.find(data => data.tableStatusId === id);
    return found || null;
  }

  getTableTypeById(id: number): TableType | null {
    const found = this.tableTypes.find(data => data.tableTypeId === id);
    return found || null;
  }

  getRestaurantById(id: number): Restaurant | null {
    const found = this.restaurants.find(data => data.restaurantId === id);
    return found || null;
  }

  openRestaurantTableInfomationModal(restaurantTable: RestaurantTable) {
    if (!this.authenticationService.getUserCache()) {
      //this.toastService.showError("Đặt bàn thất bại mời đăng nhập");
    } else {
      const modalRef = this.modalService.open(UserRestaurantTableInfomationComponent, { size: 'lg' });
      modalRef.componentInstance.restaurantTable = restaurantTable;

      // Subscribe to the emitted event
      modalRef.componentInstance.restaurantTableSaved.subscribe(() => {
        this.getRestaurantTables(); // Refresh data in the parent component
      });
    }
  }

  openUserReservationHistoriesModal() {
    if (!this.authenticationService.getUserCache()) {
      //this.toastService.showError("Đặt bàn thất bại mời đăng nhập");
    } else {
      const modalRef = this.modalService2.open(UserReservationHistoriesComponent, { size: 'lg' });
      modalRef.componentInstance.userId = this.authenticationService.getUserCache()?.userId;
    }
  }

}
