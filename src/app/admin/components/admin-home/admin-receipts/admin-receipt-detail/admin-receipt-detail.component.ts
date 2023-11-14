import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Receipt } from 'src/app/interfaces/receipt';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-admin-receipt-detail',
  templateUrl: './admin-receipt-detail.component.html',
  styleUrls: ['./admin-receipt-detail.component.css']
})
export class AdminReceiptDetailComponent {
  @Input() receipt: Receipt | undefined;
  fieldNames: string[] = [];
  receipts: Receipt[] = [];
  receiptForm: FormGroup;
  
  constructor(
    private receiptService: ReceiptService, // Đổi tên service nếu cần
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.receiptForm = this.formBuilder.group({
      receiptId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      totalAmount: ['', [Validators.required]],
      inventory: ['', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.setValue();
  }
  
  setValue() {
    if (this.receipt) {
      this.receiptForm.patchValue({
        receiptId: this.receipt.receiptId,
        userId: this.receipt.userId,
        supplier: this.receipt.supplier,
        date: this.receipt.date,
        totalAmount: this.receipt.totalAmount,
        inventory: this.receipt.inventory,
      });
    }
  }
  
  updateReceipt(): void {
    this.activeModal.close('Close after saving');
    if (this.receiptForm.valid) {
      const updatedReceipt: Receipt = {
        receiptId: this.receiptForm.get('receiptId')?.value,
        userId: this.receiptForm.get('userId')?.value,
        supplier: this.receiptForm.get('supplier')?.value,
        date: this.receiptForm.get('date')?.value,
        totalAmount: this.receiptForm.get('totalAmount')?.value,
        inventory: this.receiptForm.get('inventory')?.value,
      };
  
      this.receiptService.updateReceipt(updatedReceipt).subscribe(() => {
        // Cập nhật cache
        this.receiptService.updateReceiptCache(updatedReceipt);
      });
    }
  }
}
