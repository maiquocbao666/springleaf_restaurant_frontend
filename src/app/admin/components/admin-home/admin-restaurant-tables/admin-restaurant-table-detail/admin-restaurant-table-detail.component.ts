import { Component, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantTable } from 'src/app/interfaces/restaurant-table';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableType } from 'src/app/interfaces/table-type';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { TableStatusService } from 'src/app/services/table-status.service';
import { TableTypeService } from 'src/app/services/table-type.service';

@Component({
  selector: 'app-admin-restaurant-table-detail',
  templateUrl: './admin-restaurant-table-detail.component.html',
  styleUrls: ['./admin-restaurant-table-detail.component.css']
})
export class AdminRestaurantTableDetailComponent {
  @Input() restaurantTable: RestaurantTable | undefined;
  tableTypes: TableType[] = [];
  tableStatuses: TableStatus[] = [];
  restaurants: Restaurant[] = [];
  fieldNames: string[] = [];
  restaurantTableForm: FormGroup;

  constructor(
    private restaurantTablesService: RestaurantTableService,
    private tableTypeService: TableTypeService,
    private tableStatusService: TableStatusService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
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
    this.setValue();
    this.getTableStatus();
    this.getTableType();
    this.getRestaurant();

  }

  setValue() {
    if (this.restaurantTable) {
      this.restaurantTableForm.patchValue({
        tableId: this.restaurantTable.tableId,
        tableName: this.restaurantTable.tableName,
        restaurantId: this.restaurantTable.restaurantId,
        tableTypeId: this.restaurantTable.tableTypeId,
        tableStatusId: this.restaurantTable.tableStatusId,
      });
    }
  }
  getTableStatus(): void {
    this.tableStatusService.getTableStatuses()
      .subscribe(tableStatus => this.tableStatuses = tableStatus);
  }
  getTableType(): void {
    this.tableTypeService.getTableTypes()
      .subscribe(tableTypes => this.tableTypes = tableTypes);
  }
  getRestaurant(): void {
    this.restaurantService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  updateRestaurantTable(): void {
    this.activeModal.close('Close after saving');
    if (this.restaurantTableForm.valid) {
      const updatedRestaurantTable: RestaurantTable = {
        tableId: this.restaurantTableForm.get('tableId')?.value,
        tableName: this.restaurantTableForm.get('tableName')?.value,
        tableStatusId: this.restaurantTableForm.get('tableStatusId')?.value,
        tableTypeId: this.restaurantTableForm.get('tableTypeId')?.value,
        restaurantId: this.restaurantTableForm.get('restaurantId')?.value
      };

      this.restaurantTablesService.updateRestaurantTable(updatedRestaurantTable).subscribe(() => {
        // Cập nhật cache
        this.restaurantTablesService.updateRestaurantTableCache(updatedRestaurantTable);
      });
    }
  }
}
