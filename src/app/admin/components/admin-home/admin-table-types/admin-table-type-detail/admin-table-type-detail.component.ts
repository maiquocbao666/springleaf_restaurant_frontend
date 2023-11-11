import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableType } from 'src/app/interfaces/table-type';
import { TableTypeService } from 'src/app/services/table-type.service';

@Component({
  selector: 'app-admin-table-type-detail',
  templateUrl: './admin-table-type-detail.component.html',
  styleUrls: ['./admin-table-type-detail.component.css']
})
export class AdminTableTypeDetailComponent  implements OnInit {
  tableTypes: TableType[] = [];
  tableTypeForm: FormGroup;
  @Input() tableType: TableType | undefined;
  fieldNames: string[] = [];

  constructor(
    private tableTypeService: TableTypeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
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
    this.setValue();
  }

  setValue() {
    if (this.tableType) {
      this.tableTypeForm.patchValue({
        tableTypeId: this.tableType.tableTypeId,
        name: this.tableType.name,
      });
    }
  }

  updateTableType(): void {
    this.activeModal.close('Close after saving');
    if (this.tableTypeForm.valid) {
      const updatedTableType: TableType = {
        tableTypeId: this.tableTypeForm.get('tableTypeId')?.value,
        name: this.tableTypeForm.get('name')?.value,
      };

      this.tableTypeService.updateTableType(updatedTableType).subscribe(() => {
        // Cập nhật cache
        this.tableTypeService.updateTableTypesCache(updatedTableType);
      });
    }
  }

}
