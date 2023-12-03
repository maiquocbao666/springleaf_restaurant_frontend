import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableType } from 'src/app/interfaces/table-type';
import { TableTypeService } from 'src/app/services/table-type.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
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
  isSubmitted = false;


  tableTypesUrl = 'tableTypes';

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
    private modalService: NgbModal,
    private sweetAlertService: ToastService


  ) {
    this.tableTypeForm = this.formBuilder.group({
      // tableTypeId: ['', [Validators.required]],
      tableTypeName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTableTypes();
  }

  getTableTypes(): void {
    this.tableTypeService.getCache().subscribe(
      (cached: any[]) => {
        this.tableTypes = cached;
      }
    );
  }

  addTableType(): void {
    this.isSubmitted = true;
    if (this.tableTypeForm.valid) {
      const tableTypeName = this.tableTypeForm.get('tableTypeName')?.value?.trim() ?? '';
      const newTableType: TableType = {
        tableTypeName: tableTypeName,
      };
      this.tableTypeService.add(newTableType)
        .subscribe(tableType => {
          this.tableTypeForm.reset();
          this.sweetAlertService.showCustomAnimatedAlert('Thành công', 'success', 'Thêm thành công')

          this.isSubmitted = false;

        });
    } else
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại', 'warning', 'Thêm thất bại')

  }

  deleteTableType(tableType: TableType): void {
    if (tableType.tableTypeId) {
      this.sweetAlertService
        .showConfirmAlert('Bạn có muốn xóa loại bàn ' + tableType.tableTypeName + '?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.tableTypeService.delete(tableType.tableTypeId!).subscribe(() => {
              console.log('Đã xóa loại bàn!');
              Swal.fire('Thành công', 'Xóa loại bàn ' + tableType.tableTypeName + ' thành công!', 'success');
              this.isSubmitted = false;
            });
          }
        });
    } else {
      Swal.fire('Thất bại', 'Không thể xóa loại bàn với mã không xác định!', 'warning');
    }
  }


  openTableTypeDetailModal(tableType: TableType) {
    const modalRef = this.modalService.open(AdminTableTypeDetailComponent, { size: 'lg' });
    modalRef.componentInstance.tableType = tableType;
    modalRef.componentInstance.tableTypeSaved.subscribe(() => {
    });
  }

}
