import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Inventory } from 'src/app/interfaces/inventory';
import { Receipt } from 'src/app/interfaces/receipt';
import { Supplier } from 'src/app/interfaces/supplier';
import { InventoryService } from 'src/app/services/inventory.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-admin-receipt-detail',
  templateUrl: './admin-receipt-detail.component.html',
  styleUrls: ['./admin-receipt-detail.component.css']
})
export class AdminReceiptDetailComponent {
  @Input() receipt: Receipt | undefined;
  @Output() receiptSaved: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  receipts: Receipt[] = [];
  receiptForm: FormGroup;
  suppliers: Supplier[] = [];
  inventories: Inventory[] = [];
  receiptsUrl = 'receipts';
  suppliersUrl = 'suppliers';
  inventoriesUrl = 'inventories';

  constructor(
    private receiptService: ReceiptService,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
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
    this.getReceipts();
    this.getInventories();
    this.getSuppliers();
  }
  
  getReceipts(): void {
    this.receiptService.getCache().subscribe(
      (cached: any[]) => {
        this.receipts = cached;
      }
    );
  }

  getInventories(): void {
    this.inventoryService.getCache().subscribe(
      (cached: any[]) => {
        this.inventories = cached;
      }
    );
  }

  getSuppliers(): void {
    this.supplierService.getCache().subscribe(
      (cached: any[]) => {
        this.suppliers = cached;
      }
    );
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
        receiptId: +this.receiptForm.get('receiptId')?.value,
        userId: +this.receiptForm.get('userId')?.value,
        supplier: +this.receiptForm.get('supplier')?.value,
        date: this.receiptForm.get('date')?.value,
        totalAmount: +this.receiptForm.get('totalAmount')?.value,
        inventory: +this.receiptForm.get('inventory')?.value,
      };
  
      this.receiptService.update(updatedReceipt).subscribe(() => {
        // Cập nhật cache
        this.receiptSaved.emit(); // Emit the event
      });
    }
  }
}
