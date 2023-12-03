import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboService } from 'src/app/services/combo.service';
import Swal from 'sweetalert2';
const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
@Component({
  selector: 'app-admin-combo-detail',
  templateUrl: './admin-combo-detail.component.html',
  styleUrls: ['./admin-combo-detail.component.css']
})
export class AdminComboDetailComponent implements OnInit {
  @Input() combo: Combo | undefined;
  @Output() comboSaved: EventEmitter<void> = new EventEmitter<void>();
  combos: Combo[] = [];
  fieldNames: string[] = [];
  comboForm: FormGroup;
  isSubmitted = false;


  constructor(
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) {
    this.comboForm = this.formBuilder.group({
      comboId: ['', [Validators.required]],
      comboName: ['', [Validators.required]],
      comboUser: ['', [Validators.required, nonNegativeNumberValidator]],
      totalAmount: ['', [Validators.required, nonNegativeNumberValidator]],
    });
  }
  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.combo) {
      this.comboForm.patchValue({
        comboId: this.combo.comboId,
        comboName: this.combo.comboName,
        comboUser: this.combo.comboUser,
        totalAmount: this.combo.totalAmount,
      });
    }
  }

  updateCombo(): void {
    this.isSubmitted = true;

    if (this.comboForm.valid) {
      const updatedCombo: Combo = {
        comboId: +this.comboForm.get('comboId')?.value,
        comboName: this.comboForm.get('comboName')?.value,
        comboUser: +this.comboForm.get('comboUser')?.value,
        totalAmount: +this.comboForm.get('totalAmount')?.value,
      };

      this.comboService.update(updatedCombo).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.comboForm.reset();
          // Cập nhật cache
          this.comboService.update(updatedCombo);
          this.comboSaved.emit(); // Emit the event
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
