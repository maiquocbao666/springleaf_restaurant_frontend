import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableType } from 'src/app/interfaces/table-type';
import { TableTypeService } from 'src/app/services/table-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-table-type-detail',
  templateUrl: './admin-table-type-detail.component.html',
  styleUrls: ['./admin-table-type-detail.component.css']
})
export class AdminTableTypeDetailComponent  implements OnInit {
  tableTypes: TableType[] = [];
  tableTypeForm: FormGroup;
  @Input() tableType: TableType | undefined;
  @Output() tableTypeSaved: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  isSubmitted = false;

  constructor(
    private tableTypeService: TableTypeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
  ) {
    this.tableTypeForm = this.formBuilder.group({
      tableTypeId: ['', [Validators.required]],
      tableTypeName: ['', [Validators.required]],
    });
  }


  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.tableType) {
      this.tableTypeForm.patchValue({
        tableTypeId: this.tableType.tableTypeId,
        tableTypeName: this.tableType.tableTypeName,
      });
    }
  }
  updateTableType(): void {
    this.isSubmitted = true;
  
    if (this.tableTypeForm.valid) {
      const updatedTableType: TableType = {
        tableTypeId: +this.tableTypeForm.get('tableTypeId')?.value,
        tableTypeName: this.tableTypeForm.get('tableTypeName')?.value,
      };
  
      this.tableTypeService.update(updatedTableType).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.tableTypeForm.reset();
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
