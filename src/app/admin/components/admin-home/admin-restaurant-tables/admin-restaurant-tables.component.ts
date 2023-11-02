import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
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
  restaurantTable: RestaurantTable | undefined;
  fieldNames: string[] = [];
  restaurantTableForm: FormGroup;


  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private restaurantTablesService: RestaurantTableService,
    private tableTypesService: TableTypeService,
    private tableStatusesService: TableStatusService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private zone: NgZone
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.restaurantTableForm = this.formBuilder.group({
      tableId: ['', [Validators.required]],
      tableName: ['', [Validators.required]],
      tableTypeId: ['', [Validators.required]],
      tableStatusId: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getRestaurantTables();
    this.getTableStatuses();
    this.getTableTypes();
    this.getRestaurants();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getRestaurantTables();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getRestaurantTables();
  }

  getRestaurantTables(): void {
    this.restaurantTablesService.getRestaurantTables()
      .subscribe(restaurantTables => this.restaurantTables = restaurantTables);
  }

  getTableStatuses(): void {
    this.tableStatusesService.getTableStatuses()
      .subscribe(tableStatus => this.tableStatuses = tableStatus);
  }

  getTableTypes(): void {
    this.tableTypesService.getTableTypes()
      .subscribe(tableTypes => this.tableTypes = tableTypes);
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  //Lấy name theo id
  getTableTypeById(tableType: number): Observable<TableType> {
    return this.tableTypesService.getTableTypeById(tableType);
  }

  getRestaurantById(restaurantId: number): Observable<Restaurant> {
    return this.restaurantService.getRestaurantById(restaurantId);

  }

  getTableStatusById(tableStatus: number): Observable<TableStatus> {
    return this.tableStatusesService.getTableStatusById(tableStatus);
  }

  addRestaurantTable(): void {
    const tableId = 0;
    const tableName = this.restaurantTableForm.get('tableName')?.value?.trim() ?? '';
    const tableTypeId = this.restaurantTableForm.get('tableTypeId')?.value;
    const tableStatusId = this.restaurantTableForm.get('tableStatusId')?.value;
    const restaurantId = this.restaurantTableForm.get('restaurantId')?.value;

    this.restaurantTablesService.addRestaurantTable({ tableId, tableName, tableTypeId, tableStatusId, restaurantId } as RestaurantTable)
      .subscribe(restaurantTable => {
        this.restaurantTables.push(restaurantTable);
        this.restaurantTableForm.reset();
      });
  }

  deleteTable(restaurantTable: RestaurantTable): void {
    this.restaurantTables = this.restaurantTables.filter(i => i !== restaurantTable);
    this.restaurantTablesService.deleteTable(restaurantTable.tableId).subscribe();
  }

  openRestaurantTableDetailModal(restaurantTable: RestaurantTable) {
    const modalRef = this.modalService.open(AdminRestaurantTableDetailComponent, { size: 'lg' });
    modalRef.componentInstance.restaurantTable = restaurantTable;
    modalRef.result.then((result) => {
      if (result === 'Close after saving') {
        this.getRestaurantTables();
      }
    });
  }

}
