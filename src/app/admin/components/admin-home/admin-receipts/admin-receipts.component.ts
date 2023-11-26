import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Inventory } from 'src/app/interfaces/inventory';
import { Receipt } from 'src/app/interfaces/receipt';
import { Supplier } from 'src/app/interfaces/supplier';
import { User } from 'src/app/interfaces/user';
import { InventoryService } from 'src/app/services/inventory.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { AdminReceiptDetailComponent } from './admin-receipt-detail/admin-receipt-detail.component';

@Component({
  selector: 'app-admin-receipts',
  templateUrl: './admin-receipts.component.html',
  styleUrls: ['./admin-receipts.component.css']
})
export class AdminReceiptsComponent {
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  receipt: Receipt | undefined;
  receipts: Receipt[] = [];
  receiptForm: FormGroup;

  users: User[] = [];
  suppliers: Supplier[] = [];
  inventories: Inventory[] = [];


  constructor(
    private receiptService: ReceiptService,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.receiptForm = this.formBuilder.group({
      userId: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      totalAmount: ['', [Validators.required]],
      inventory: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getReceipts();
    this.getInventories();
    this.getSuppliers();
  }

  getReceipts(): void {
    this.receiptService.cache$
      .subscribe(receipts => this.receipts = receipts);
  }

  getInventories(): void {
    this.inventoryService.cache$
      .subscribe(inventories => this.inventories = inventories);
  }

  getSuppliers(): void {
    this.supplierService.cache$
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  addReceipt(): void {
    const userId = this.receiptForm.get('userId')?.value;
    const supplier = this.receiptForm.get('supplier')?.value;
    const date = this.receiptForm.get('date')?.value;
    const totalAmount = this.receiptForm.get('totalAmount')?.value;
    const inventory = this.receiptForm.get('inventory')?.value;

    if (!userId || !supplier || !date || !totalAmount || !inventory) { return; }

    const newReceipt: Receipt = {
      userId: userId,
      supplier: supplier,
      date: date,
      totalAmount: totalAmount,
      inventory: inventory,
    }

    this.receiptService.add(newReceipt)
      .subscribe(() => {
        this.receiptForm.reset();
      });
  }

  deleteReceipt(receipt: Receipt): void {

    if (receipt.receiptId) {
      this.receiptService.delete(receipt.receiptId).subscribe();
    } else {
      console.log("Không có receiptId");
    }

  }


  openReceiptDetailModal(receipt: Receipt) {
    const modalRef = this.modalService.open(AdminReceiptDetailComponent, { size: 'lg' });
    modalRef.componentInstance.receipt = receipt;
    modalRef.componentInstance.receiptSaved.subscribe(() => {
    });
  }

}
