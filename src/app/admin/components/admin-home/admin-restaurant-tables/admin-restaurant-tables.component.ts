import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableType } from 'src/app/interfaces/table-type';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';
import { ToastService } from 'src/app/services/toast.service';
import { AdminRestaurantTableDetailComponent } from './admin-restaurant-table-detail/admin-restaurant-table-detail.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-admin-restaurant-tables',
  templateUrl: './admin-restaurant-tables.component.html',
  styleUrls: ['./admin-restaurant-tables.component.css']
})
export class AdminRestaurantTablesComponent {

  restaurantTables: RestaurantTable[] = [];
  tableTypes: TableType[] = [];
  tableStatuses: TableStatus[] = [];
  restaurants: Restaurant[] = [];
  //restaurantTable: RestaurantTable | undefined;
  fieldNames: string[] = [];
  restaurantTableForm: FormGroup;
  isSubmitted = false;
  user: User | null = null;


  restaurantTablesUrl = 'restaurantTables';
  tableTypesUrl = 'tableTypes';
  tableStatusesUrl = 'tableStatuses';
  restaurantsUrl = 'restaurants';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private restaurantTableService: RestaurantTableService,
    private tableTypeService: TableTypeService,
    private tableStatusService: TableStatusService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    private authService: AuthenticationService,

  ) {
    this.restaurantTableForm = new FormGroup({
      // tableId: new FormControl('', Validators.required),
      tableName: new FormControl('', Validators.required),
      tableTypeId: new FormControl('', Validators.required),
      tableStatusId: new FormControl(''),
      restaurantId: new FormControl('', Validators.required),
      seatingCapacity: new FormControl(1)
    });

    this.restaurantTableForm.patchValue({
      tableStatusId: 'Đang hoạt động',
    });

    this.authService.getUserCache().subscribe((data) => {
      this.user = data;
      //alert(this.user?.restaurantBranchId);
    });

  }

  numbersArray = Array.from({ length: 10 }, (_, index) => index + 1);

  ngOnInit(): void {
    this.getRestaurantTables();
    this.getTableStatuses();
    this.getTableTypes();
    this.getRestaurants();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getRestaurantTables(): void {
    this.restaurantTableService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurantTables = cached.filter(table => table.restaurantId = this.user?.restaurantBranchId);
      }
    );
  }

  getTableStatuses(): void {
    this.tableStatusService.getCache().subscribe(
      (cached: any[]) => {
        this.tableStatuses = cached;
      }
    );
  }

  getTableTypes(): void {
    this.tableTypeService.getCache().subscribe(
      (cached: any[]) => {
        this.tableTypes = cached;
      }
    );
  }

  getRestaurants(): void {
    this.restaurantService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  //Lấy name theo id
  getTableTypeById(tableTypeId: number): TableType | null {
    const foundTableType = this.tableTypes.find(type => type.tableTypeId === tableTypeId);
    if (foundTableType) {
      return foundTableType;
    } else {
      return null;
    }
  }

  getRestaurantById(restaurantId: number): Restaurant | null {
    const found = this.restaurants.find(object => object.restaurantId === restaurantId);
    if (found) {
      return found;
    } else {
      return null;
    }
  }

  getTableStatusById(tableStatusId: number): TableStatus | null {
    const foundTableStatus = this.tableStatuses.find(status => status.tableStatusId === tableStatusId);
    if (foundTableStatus) {
      return foundTableStatus;
    } else {
      return null;
    }
  }

  addRestaurantTable(): void {
    this.isSubmitted = true;
    if (this.restaurantTableForm.valid) {
      const tableName = this.restaurantTableForm.get('tableName')?.value?.trim() ?? '';
      const tableTypeId = this.restaurantTableForm.get('tableTypeId')?.value;
      const restaurantId = this.restaurantTableForm.get('restaurantId')?.value;
      const tableStatusId = this.restaurantTableForm.get('tableStatusId')?.value;
      const seatingCapacity = this.restaurantTableForm.get('seatingCapacity')?.value;
      const description = this.restaurantTableForm.get('description')?.value?.trim() ?? '';

    const newRestaurantTable: RestaurantTable = {
      tableName: tableName,
      tableTypeId: +tableTypeId,
      tableStatusId: tableStatusId || 'Không hoạt động',
      restaurantId: this.user?.restaurantBranchId || +restaurantId,
      seatingCapacity: +seatingCapacity,
      description: description,
    };

      this.restaurantTableService.add(newRestaurantTable)
        .subscribe(restaurantTable => {
          this.restaurantTableForm.reset();
          this.restaurantTableForm.get('seatingCapacity')?.setValue(1);
          this.isSubmitted = false;
          this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
        });
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại , chưa nhập dữ liệu', 'warning', 'animated tada');
    }
  }

  deleteTable(restaurantTable: RestaurantTable): void {
    if (restaurantTable.tableId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa bàn ' + restaurantTable.tableName + '?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.restaurantTableService.delete(restaurantTable.tableId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa bàn ' + restaurantTable.tableName + ' thành công', 'success');
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa bàn ' + restaurantTable.tableName, 'error');
                  console.error('Lỗi khi xóa bàn ăn:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có tableId!', 'Không có tableId để xóa.', 'info');
    }
  }


  openRestaurantTableDetailModal(restaurantTable: RestaurantTable) {
    const modalRef = this.modalService.open(AdminRestaurantTableDetailComponent, { size: 'lg' });
    modalRef.componentInstance.restaurantTable = restaurantTable;
    modalRef.componentInstance.restaurantTableSaved.subscribe(() => {

    });
    modalRef.result.then((result) => {
      if (result === 'Close after saving') {

      }
    });
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getRestaurantTables();
    } else {
      this.restaurantTableService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.restaurantTables = data;
        }
      );
    }
  }

  fieldName!: keyof RestaurantTable;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any){
    this.keywords = event.target.value;
    this.search();
  }

}
