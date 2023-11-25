import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboService } from 'src/app/services/combo.service';

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

  constructor(
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) {
    this.comboForm = this.formBuilder.group({
      comboId: ['', [Validators.required]],
      comboName: ['', [Validators.required]],
      comboUser: ['', [Validators.required]],
      totalAmount: ['', [Validators.required]],
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
    this.activeModal.close('Close after saving');
    if (this.comboForm.valid) {
      const updatedCombo: Combo = {
        comboId: +this.comboForm.get('comboId')?.value,
        comboName: this.comboForm.get('comboName')?.value,
        comboUser: +this.comboForm.get('comboUser')?.value,
        totalAmount: +this.comboForm.get('totalAmount')?.value,
      };

      this.comboService.update(updatedCombo).subscribe(() => {
        // Cập nhật cache
        this.comboService.updateComboCache(updatedCombo);
        this.comboSaved.emit(); // Emit the event
      });
    }
  }
}
