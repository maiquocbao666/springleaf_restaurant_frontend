import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-restaurant-table-detail',
  templateUrl: './admin-restaurant-table-detail.component.html',
  styleUrls: ['./admin-restaurant-table-detail.component.css']
})
export class AdminRestaurantTableDetailComponent implements OnInit {
  @Input() restaurantTable: RestaurantTable | undefined;
  @Output() restaurantTableSaved: EventEmitter<void> = new EventEmitter<void>();
  tableTypes: TableType[] = [];
  tableStatuses: TableStatus[] = [];
  restaurants: Restaurant[] = [];
  fieldNames: string[] = [];
  restaurantTableForm: FormGroup;
  isSubmitted = false;


  restaurantTablesUrl = 'restaurantTables';
  tableTypesUrl = 'tableTypes';
  tableStatusesUrl = 'tableStatuses';
  restaurantsUrl = 'restaurants';

  numbersArray = Array.from({length: 10}, (_, index) => index + 1);

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
    this.restaurantTableForm = this.formBuilder.group({
      tableId: ['', [Validators.required]],
      tableName: ['', [Validators.required]],
      tableTypeId: ['', [Validators.required]],
      tableStatusId: [],
      restaurantId: ['', [Validators.required]],
      seatingCapacity: [1, [Validators.nullValidator]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getTableStatuses();
    this.getTableTypes();
    this.getRestaurants();

  }

  setValue() {
    if (this.restaurantTable) {
      this.restaurantTableForm.patchValue({
        tableId: this.restaurantTable.tableId,
        tableName: this.restaurantTable.tableName,
        restaurantId: this.restaurantTable.restaurantId,
        tableTypeId: this.restaurantTable.tableTypeId,
        tableStatusId: this.restaurantTable.tableStatusId,
        description: this.restaurantTable.description,
      });
    }
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

  updateRestaurantTable(): void {
    this.isSubmitted = true;
  
    if (this.restaurantTableForm.valid) {
      const updatedRestaurantTable: RestaurantTable = {
        tableId: +this.restaurantTableForm.get('tableId')?.value,
        tableName: this.restaurantTableForm.get('tableName')?.value,
        tableStatusId: this.restaurantTableForm.get('tableStatusId')?.value,
        tableTypeId: +this.restaurantTableForm.get('tableTypeId')?.value,
        restaurantId: +this.restaurantTableForm.get('restaurantId')?.value,
        seatingCapacity: +this.restaurantTableForm.get('seatingCapacity')?.value,
        description: this.restaurantTableForm.get('description')?.value,
      };
  
      this.restaurantTablesService.update(updatedRestaurantTable).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.restaurantTableForm.reset();
        },
        (error) => {
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'warning');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      Swal.fire('Thất bại', 'Cập nhật không thành công!', 'warning');
    }
  }
  
}
