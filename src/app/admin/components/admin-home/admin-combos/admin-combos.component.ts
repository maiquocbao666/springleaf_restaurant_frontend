import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Combo } from 'src/app/interfaces/combo';
import { ComboService } from 'src/app/services/combo.service';
import { ToastService } from 'src/app/services/toast.service';
import { AdminComboDetailComponent } from './admin-combo-detail/admin-combo-detail.component';
const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
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
  isSubmitted = false;

  combosUrl = 'combos';


  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private comboService: ComboService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.comboForm = this.formBuilder.group({
      // comboId: ['', [Validators.required]],
      comboName: ['', [Validators.required]],
      comboUser: ['', [Validators.required, nonNegativeNumberValidator]],
      totalAmount: ['', [Validators.required, nonNegativeNumberValidator]],
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
    this.isSubmitted = true;
    if (this.comboForm.valid) {
      const comboName = this.comboForm.get('comboName')?.value;
      const comboUser = this.comboForm.get('comboUser')?.value;
      const totalAmount = this.comboForm.get('totalAmount')?.value;

      const newCombo: Combo = {
        comboName: comboName,
        comboUser: comboUser,
        totalAmount: totalAmount
      };

      this.comboService.add(newCombo)
        .subscribe(
          () => {
            this.comboForm.reset();
            this.isSubmitted = false;
            this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
          },
          (error) => {
            this.sweetAlertService.showCustomAnimatedAlert('Thất bại, không thể thêm', 'warning', 'animated tada');
            console.error('Lỗi khi thêm:', error);
          }
        );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại, chưa nhập đủ dữ liệu', 'warning', 'animated tada');
    }
  }

  deleteCombo(combo: Combo): void {
    if (combo.comboId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa combo?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.comboService.delete(combo.comboId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa combo thành công', 'success');
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa combo', 'error');
                  console.error('Lỗi khi xóa combo:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có comboId!', 'Không có comboId để xóa.', 'info');
    }
  }


  openComboDetailModal(combo: Combo) {
    const modalRef = this.modalService.open(AdminComboDetailComponent, { size: 'lg' });
    modalRef.componentInstance.combo = combo;
    modalRef.componentInstance.comboSaved.subscribe(() => {
    });
  }
}
