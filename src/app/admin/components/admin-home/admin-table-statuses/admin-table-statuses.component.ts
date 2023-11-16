import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableStatusService } from 'src/app/services/table-status.service';
import { AdminTableStatusDetailComponent } from './admin-table-status-detail/admin-table-status-detail.component';
import { RestaurantTableService } from 'src/app/services/restaurant-table.service';

@Component({
  selector: 'app-admin-table-statuses',
  templateUrl: './admin-table-statuses.component.html',
  styleUrls: ['./admin-table-statuses.component.css']
})
export class AdminTableStatusesComponent {
  tableStatuses: TableStatus[] = [];
  tableStatusForm: FormGroup;
  tableStatus: TableStatus | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  isCustomChecked = false;

  constructor(
    private tableStatusService: TableStatusService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private restaurantTableService: RestaurantTableService,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.tableStatusForm = this.formBuilder.group({
      tableStatusId: ['', [Validators.required]],
      statusName: new FormControl({ value: '', disabled: false }),
      name: new FormControl({ value: '', disabled: true }),
    });
  }

  ngOnInit(): void {
    this.getTableStatuses();
  }

  // Handle the checkbox change event
  onCheckboxChange(event: any) {

    this.isCustomChecked = event.checked;

    const nameControl = this.tableStatusForm.get('name');
    const statusNameControl = this.tableStatusForm.get('statusName');
    if (nameControl) {
      if (this.isCustomChecked) {
        nameControl.enable();
        statusNameControl?.disable();
      } else {
        nameControl.disable();
        statusNameControl?.enable();
      }
    }
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getTableStatuses();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getTableStatuses();
  }

  getTableStatuses(): void {
    this.tableStatusService.getTableStatuses()
      .subscribe(tableStatuses => this.tableStatuses = tableStatuses);
  }

  addTableStatus(): void {

    let name = '';

    if (this.isCustomChecked) {
      name = this.tableStatusForm.get('name')?.value?.trim() ?? '';
    } else {
      name = this.tableStatusForm.get('statusName')?.value?.trim() ?? '';
    }

    const newTableStatus: TableStatus = {
      tableStatusName: name,
    }

    this.tableStatusService.addTableStatus(newTableStatus)
      .subscribe(tableStatus => {
        this.getTableStatuses();
        this.tableStatusForm.reset();
      });

  }

  deleteTableStatus(tableStatus: TableStatus): void {

    if (tableStatus.tableStatusId) {

      if(this.restaurantTableService.findTableByStatusId(tableStatus?.tableStatusId)){
        console.log("Có bàn đang sử dụng status này, không thể xóa");
        return;
      }

      this.tableStatuses = this.tableStatuses.filter(i => i !== tableStatus);
      this.tableStatusService.deleteTableStatus(tableStatus.tableStatusId).subscribe();

    } else {
      console.log("Không có tableStautsId");
    }

  }

  openTableStatusDetailModal(tableStatus: TableStatus) {
    const modalRef = this.modalService.open(AdminTableStatusDetailComponent, { size: 'lg' });
    modalRef.componentInstance.tableStatus = tableStatus;
  }

}
