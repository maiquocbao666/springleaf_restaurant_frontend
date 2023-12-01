import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableType } from 'src/app/interfaces/table-type';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';
import { AdminRestaurantTableDetailComponent } from './admin-restaurant-table-detail/admin-restaurant-table-detail.component';

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
  ) {
    this.restaurantTableForm = this.formBuilder.group({
      tableId: ['', [Validators.required]],
      tableName: ['', [Validators.required]],
      tableTypeId: ['', [Validators.required]],
      tableStatusId: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]],
      seatingCapacity: [1, [Validators.nullValidator]]
    });
  }

  numbersArray = Array.from({length: 10}, (_, index) => index + 1);

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
        this.restaurantTables = cached;
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
    const tableName = this.restaurantTableForm.get('tableName')?.value?.trim() ?? '';
    const tableTypeId = this.restaurantTableForm.get('tableTypeId')?.value;
    const tableStatusId = this.restaurantTableForm.get('tableStatusId')?.value;
    const restaurantId = this.restaurantTableForm.get('restaurantId')?.value;
    const seatingCapacity = this.restaurantTableForm.get('seatingCapacity')?.value;

    const newRestaurantTable: RestaurantTable = {
      tableName: tableName,
      tableTypeId: +tableTypeId,
      tableStatusId: +tableStatusId,
      restaurantId: +restaurantId,
      seatingCapacity: +seatingCapacity
    };

    this.restaurantTableService.add(newRestaurantTable)
      .subscribe(restaurantTable => {
        this.restaurantTableForm.reset();
        this.restaurantTableForm.get('seatingCapacity')?.setValue(1);
    });
  }

  deleteTable(restaurantTable: RestaurantTable): void {

    if (restaurantTable.tableId) {
      this.restaurantTableService.delete(restaurantTable.tableId).subscribe();
    } {
      console.log("Không có restaurantTableId");
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

}
