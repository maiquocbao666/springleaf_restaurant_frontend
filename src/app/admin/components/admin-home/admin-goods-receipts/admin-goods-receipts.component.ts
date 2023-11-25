import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GoodsReceipt } from 'src/app/interfaces/goods-receipt';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { AdminGoodsReceiptDetailComponent } from './admin-goods-receipt-detail/admin-goods-receipt-detail.component';

@Component({
  selector: 'app-admin-goods-receipts',
  templateUrl: './admin-goods-receipts.component.html',
  styleUrls: ['./admin-goods-receipts.component.css']
})
export class AdminGoodsReceiptsComponent {
  goodsReceipts: GoodsReceipt[] = [];
  goodsReceiptForm: FormGroup;
  goodsReceipt: GoodsReceipt | undefined;
  inventoryBranches: InventoryBranch[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private goodsReceiptService: GoodsReceiptService,
    private inventoryBranchService: InventoryBranchService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.goodsReceiptForm = this.formBuilder.group({
      goodsReceiptId: ['', [Validators.required]],
      inventoryBrand: ['', [Validators.required]],
      date: ['', [Validators.required]],
      warehouseManager: ['', [Validators.required]],
      user: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getInventoryBranches();
    this.getGoodsReceipts();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getGoodsReceipts(): void {
    this.goodsReceiptService.goodsReceiptsCache$
      .subscribe(goodsReceipts => this.goodsReceipts = goodsReceipts);
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.inventoryBranchesCache$
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }

  getInventoryBranchById(inventoryBranchId: number): Observable<InventoryBranch> {
    return this.inventoryBranchService.getById(inventoryBranchId);
  }

  addGoodsReceipt(): void {
    const inventoryBranch = this.goodsReceiptForm.get('inventoryBranch')?.value;
    const date = this.goodsReceiptForm.get('date')?.value;
    const warehouseManager = this.goodsReceiptForm.get('warehouseManager')?.value;
    const user = this.goodsReceiptForm.get('user')?.value;

    this.goodsReceiptService.add({ inventoryBranch, date, warehouseManager, user } as GoodsReceipt)
      .subscribe(goodsReceipt => {
        this.goodsReceiptForm.reset();
      });
  }

  deleteGoodsReceipt(goodsReceipt: GoodsReceipt): void {

    if(goodsReceipt.goodsReceiptId){
      this.goodsReceiptService.delete(goodsReceipt.goodsReceiptId).subscribe();
    } else {
      console.log("Không có goodsReceiptId");
    }

   
  }

  openGoodsReceiptDetailModal(goodsReceipt: GoodsReceipt) {
    const modalRef = this.modalService.open(AdminGoodsReceiptDetailComponent, { size: 'lg' });
    modalRef.componentInstance.goodsReceipt = goodsReceipt;
    modalRef.componentInstance.goodsReceiptSaved.subscribe(() => {
    });
  }

}
