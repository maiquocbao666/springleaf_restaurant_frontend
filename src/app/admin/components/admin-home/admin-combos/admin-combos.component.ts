import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboService } from 'src/app/services/combo.service';
import { AdminComboDetailComponent } from './admin-combo-detail/admin-combo-detail.component';

@Component({
  selector: 'app-admin-combos',
  templateUrl: './admin-combos.component.html',
  styleUrls: ['./admin-combos.component.css']
})
export class AdminCombosComponent {

  combos: Combo[] = [];
  comboForm: FormGroup;
  combo: Combo | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private comboService: ComboService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.comboForm = this.formBuilder.group({
      comboId: ['', [Validators.required]],
      comboName: ['', [Validators.required]],
      comboUser: ['', [Validators.required]],
      totalAmount: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCombos();
  }

  getCombos(): void {
    this.comboService.getCombos()
      .subscribe(combos => this.combos = combos);
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCombos();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCombos();
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }


  addCombo(): void {

    const comboName = this.comboForm.get('comboName')?.value;
    const comboUser = this.comboForm.get('comboUser')?.value;
    const totalAmount = this.comboForm.get('totalAmount')?.value;

    this.comboService.addCombo({ comboName, comboUser, totalAmount } as Combo)
      .subscribe(combo => {
        this.combos.push(combo);
        this.getCombos();
        this.comboForm.reset();
      });
  }

  deleteCombo(combo: Combo): void {
    this.combos = this.combos.filter(i => i !== combo);
    this.comboService.deleteCombo(combo.comboId).subscribe();
  }

  openComboDetailModal(combo: Combo) {
    const modalRef = this.modalService.open(AdminComboDetailComponent, { size: 'lg' });
    modalRef.componentInstance.combo = combo;

  }
}
