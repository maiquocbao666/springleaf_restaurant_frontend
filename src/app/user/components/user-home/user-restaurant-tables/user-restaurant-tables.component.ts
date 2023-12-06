import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Reservation } from 'src/app/interfaces/reservation';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableType } from 'src/app/interfaces/table-type';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserMergeTablesComponent } from './user-merge-tables/user-merge-tables.component';
import { UserReservationHistoriesComponent } from './user-reservation-histories/user-reservation-histories.component';
import { UserRestaurantTableInfomationComponent } from './user-restaurant-table-infomation/user-restaurant-table-infomation.component';

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
    private modalService3: NgbModal,
    private restaurantTableService: RestaurantTableService,
    private tableStatusService: TableStatusService,
    private authenticationService: AuthenticationService,
    private tableTypeService: TableTypeService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private sweetAlertService: ToastService,
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

  openUserMergeTablesModal() {
    if (!this.authenticationService.getUserCache()) {
      this.sweetAlertService.showTimedAlert('Không thể mở!', 'Mời đăng nhập', 'error', 3000);
      return;
    }

    let check = true;
    let reservationInUse: Reservation[] = []

    this.reservationService.getReservationsInUseByUserId(this.authenticationService.getUserCache()?.userId!).subscribe(reservations => {
      if (reservations.length > 0) {
        reservationInUse = reservations;

        // Mở modal với kích thước lớn
        const modalRef = this.modalService2.open(UserMergeTablesComponent, {
          size: 'xl', // xl là kích thước lớn hơn
          centered: false, // Đặt modal ở giữa trang
          scrollable: true, // Cho phép cuộn nếu modal quá lớn
        });

        // Truyền dữ liệu đến modal
        modalRef.componentInstance.reservationOfUser = reservationInUse;
      } else {
        this.sweetAlertService.showTimedAlert('Không thể mở!', 'Bạn đang không sử dụng bàn nào', 'error', 3000);
        check = false;
      }
    });
  }

}
