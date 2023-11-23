import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableStatus } from 'src/app/interfaces/table-status';
import { TableStatusService } from 'src/app/services/table-status.service';

@Component({
  selector: 'app-admin-table-status-detail',
  templateUrl: './admin-table-status-detail.component.html',
  styleUrls: ['./admin-table-status-detail.component.css']
})
export class AdminTableStatusDetailComponent  implements OnInit {
  @Input() tableStatus: TableStatus | undefined;
  @Output() tableStatusSaved: EventEmitter<void> = new EventEmitter<void>();
  tableStatuses: TableStatus[] = [];
  fieldNames: string[] = [];
  tableStatusForm: FormGroup;

  constructor(
    private tableStatusService: TableStatusService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private zone: NgZone) {
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
    this.setValue();
  }

  setValue() {
    if (this.tableStatus) {
      this.tableStatusForm.patchValue({
        tableStatusId: this.tableStatus.tableStatusId,
        name: this.tableStatus.tableStatusName,
      });
    }
  }

  updateTableStatus(): void {
    this.activeModal.close('Close after saving');
    if (this.tableStatusForm.valid) {
      const updatedTableStatus: TableStatus = {
        tableStatusId: +this.tableStatusForm.get('tableStatusId')?.value,
        tableStatusName: this.tableStatusForm.get('name')?.value,
      };

      this.tableStatusService.updateTableStatus(updatedTableStatus).subscribe(() => {
      });
    }
  }
}
