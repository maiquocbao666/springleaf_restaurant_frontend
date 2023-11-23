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
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1; 
  }

  constructor(
    private tableTypeService: TableTypeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.tableTypeForm = this.formBuilder.group({
      tableTypeId: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTableTypes();
  }

  getTableTypes(): void {
    this.tableTypeService.tableTypesCache$
      .subscribe(tableTypes => this.tableTypes = tableTypes);
  }

  addTableType(): void {
    const name = this.tableTypeForm.get('name')?.value?.trim() ?? '';

    const newTableType: TableType = {
      tableTypeName: name,
    };

    this.tableTypeService.addTableType(newTableType)
      .subscribe(tableType => {
        this.tableTypeForm.reset();
      });
  }

  deleteTableType(tableType: TableType): void {

    if (tableType.tableTypeId) {
      this.tableTypeService.deleteTableType(tableType.tableTypeId).subscribe();
    } else {
      console.log("Không có tableTypeId");
    }


  }

  openTableTypeDetailModal(tableType: TableType) {
    const modalRef = this.modalService.open(AdminTableTypeDetailComponent, { size: 'lg' });
    modalRef.componentInstance.tableType = tableType;
    modalRef.componentInstance.tableTypeSaved.subscribe(() => {
    });
  }

}
