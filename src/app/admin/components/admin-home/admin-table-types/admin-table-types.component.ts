import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableType } from 'src/app/interfaces/table-type';
import { TableTypeService } from 'src/app/services/table-type.service';
import { AdminTableTypeDetailComponent } from './admin-table-type-detail/admin-table-type-detail.component';

@Component({
  selector: 'app-admin-table-types',
  templateUrl: './admin-table-types.component.html',
  styleUrls: ['./admin-table-types.component.css']
})
export class AdminTableTypesComponent {
  tableTypes: TableType[] = [];
  tableTypeForm: FormGroup;
  tableType: TableType | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  onTableDataChange(event: any) {
    this.page = event;
    this.getTableTypes();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getTableTypes();
  }

  constructor(
    private tableTypeService: TableTypeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.tableTypeForm = this.formBuilder.group({
      tableTypeId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTableTypes();
  }

  getTableTypes(): void {
    this.tableTypeService.getTableTypes()
      .subscribe(tableTypes => this.tableTypes = tableTypes);
  }

  addTableType(): void {
    const name = this.tableTypeForm.get('name')?.value?.trim() ?? '';
    this.tableTypeService.addTableType({ name } as TableType)
      .subscribe(tableType => {
        this.tableTypes.push(tableType);
        this.tableTypeForm.reset();
      });
  }

  deleteTableType(tableType: TableType): void {
    this.tableTypes = this.tableTypes.filter(i => i !== tableType);
    this.tableTypeService.deleteTableType(tableType.tableTypeId).subscribe();
  }

  openTableTypeDetailModal(tableType: TableType) {
    const modalRef = this.modalService.open(AdminTableTypeDetailComponent, { size: 'lg' });
    modalRef.componentInstance.tableType = tableType;
  }

}
