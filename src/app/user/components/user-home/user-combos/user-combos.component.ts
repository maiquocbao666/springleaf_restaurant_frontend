import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboService } from 'src/app/services/combo.service';
import { UserComboDetailComponent } from './user-combo-detail/user-combo-detail.component';

@Component({
  selector: 'app-user-combo',
  templateUrl: './user-combos.component.html',
  styleUrls: ['./user-combos.component.css']
})
export class UserCombosComponent {

  combos: Combo[] = [];
  comboForm: FormGroup;
  combo!: Combo;
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

  addCombo(): void {

    const comboName = this.comboForm.get('comboName')?.value;
    const comboUser = this.comboForm.get('comboUser')?.value;
    const totalAmount = this.comboForm.get('totalAmount')?.value;

    this.comboService.add({ comboName, comboUser, totalAmount } as Combo)
      .subscribe(combo => {
        this.comboForm.reset();
      });
  }

  deleteCombo(combo: Combo): void {
    if (combo.comboId) {
      this.comboService.delete(combo.comboId).subscribe();
    } else {
      console.error("Combo ID is undefined. Cannot delete combo.");
    }
  }

  openComboDetailModal(combo: Combo) {
    const modalRef = this.modalService.open(UserComboDetailComponent, { size: 'lg' });
    modalRef.componentInstance.combo = combo;
  }
}
