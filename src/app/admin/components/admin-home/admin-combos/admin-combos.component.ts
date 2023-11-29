import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  combosUrl = 'combos';


  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {
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
    this.comboService.getCache().subscribe(
      (cached: any[]) => {
        this.combos = cached;
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }


  addCombo(): void {

    const comboName = this.comboForm.get('comboName')?.value;
    const comboUser = this.comboForm.get('comboUser')?.value;
    const totalAmount = this.comboForm.get('totalAmount')?.value;

    const newCombo: Combo = {
      comboName: comboName,
      comboUser: comboUser,
      totalAmount: totalAmount
    };

    this.comboService.add(newCombo)
      .subscribe(combo => {
        this.comboForm.reset();
      });
  }

  deleteCombo(combo: Combo): void {

    if (combo.comboId) {
      this.comboService.delete(combo.comboId).subscribe();
    } else {
      console.log("Không có comboId");
    }


  }

  openComboDetailModal(combo: Combo) {
    const modalRef = this.modalService.open(AdminComboDetailComponent, { size: 'lg' });
    modalRef.componentInstance.combo = combo;
    modalRef.componentInstance.comboSaved.subscribe(() => {
    });
  }
}
