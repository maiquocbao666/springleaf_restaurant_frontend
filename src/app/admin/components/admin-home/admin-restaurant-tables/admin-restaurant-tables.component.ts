import { Component } from '@angular/core';
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
  ) {
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
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getRestaurantTables(): void {
    this.restaurantTablesService.cache$
      .subscribe(restaurantTables => this.restaurantTables = restaurantTables);
  }

  getTableStatuses(): void {
    this.tableStatusesService.cache$
      .subscribe(tableStatus => this.tableStatuses = tableStatus);
  }

  getTableTypes(): void {
    this.tableTypesService.cache$
      .subscribe(tableTypes => this.tableTypes = tableTypes);
  }

  getRestaurants(): void {
    this.restaurantService.cache$
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  //Lấy name theo id
  getTableTypeById(tableTypeId: number): Observable<TableType | null> {
    return this.tableTypesService.getById(tableTypeId);
  }

  getRestaurantById(restaurantId: number): Observable<Restaurant | null> {
    return this.restaurantService.getById(restaurantId);
  }

  getTableStatusById(tableStatusId: number): Observable<TableStatus | null> {
    return this.tableStatusesService.getById(tableStatusId);
  }

  addRestaurantTable(): void {
    const tableName = this.restaurantTableForm.get('tableName')?.value?.trim() ?? '';
    const tableTypeId = this.restaurantTableForm.get('tableTypeId')?.value;
    const tableStatusId = this.restaurantTableForm.get('tableStatusId')?.value;
    const restaurantId = this.restaurantTableForm.get('restaurantId')?.value;

    const newRestaurantTable: RestaurantTable = {
      tableName: tableName,
      tableTypeId: tableTypeId,
      tableStatusId: tableStatusId,
      restaurantId: restaurantId,
    };

    this.restaurantTablesService.add(newRestaurantTable)
      .subscribe(restaurantTable => {
        this.restaurantTableForm.reset();
      });
  }

  deleteTable(restaurantTable: RestaurantTable): void {

    if (restaurantTable.tableId) {
      this.restaurantTables = this.restaurantTables.filter(i => i !== restaurantTable);
      this.restaurantTablesService.delete(restaurantTable.tableId).subscribe();
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
