import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableStatusService } from 'src/app/services/table-status.service';
import { AdminTableStatusDetailComponent } from './admin-table-status-detail/admin-table-status-detail.component';

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


  onTableDataChange(event: any) {
    this.page = event;
    this.getTableStatuses();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getTableStatuses();
  }

  constructor(
    private tableStatusService: TableStatusService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.tableStatusForm = this.formBuilder.group({
      tableStatusId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTableStatuses();
  }

  getTableStatuses(): void {
    this.tableStatusService.getTableStatuses()
      .subscribe(tableStatuses => this.tableStatuses = tableStatuses);
  }

  addTableStatus(): void {
    const name = this.tableStatusForm.get('name')?.value?.trim() ?? '';
    this.tableStatusService.addTableStatus({ name } as TableStatus)
      .subscribe(tableStatus => {
        this.tableStatuses.push(tableStatus);
        this.tableStatusForm.reset();
      });
  }

  deleteTableStatus(tableStatus: TableStatus): void {
    this.tableStatuses = this.tableStatuses.filter(i => i !== tableStatus);
    this.tableStatusService.deleteTableStatus(tableStatus.tableStatusId).subscribe();
  }

  openTableStatusDetailModal(tableStatus: TableStatus) {
    const modalRef = this.modalService.open(AdminTableStatusDetailComponent, { size: 'lg' });
    modalRef.componentInstance.tableStatus = tableStatus;
  }
}
