import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cart } from 'src/app/interfaces/cart';
import { GoodsReceipt } from 'src/app/interfaces/goods-receipt';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { CartService } from 'src/app/services/cart.service';
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
  carts: Cart[] = [];
  goodsReceiptForm: FormGroup;
  goodsReceipt: GoodsReceipt | undefined;
  inventoryBranches: InventoryBranch[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  cartsUrl = 'Carts';
  goodsReceiptsUrl = 'GoodsReceipts';
  inventoryBranchesUrl = 'InventoryBranches';

  constructor(
    private goodsReceiptService: GoodsReceiptService,
    private inventoryBranchService: InventoryBranchService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.goodsReceiptForm = this.formBuilder.group({
      goodsReceiptId: ['', [Validators.required]],
      inventoryBranchId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      warehouseManagerId: ['', [Validators.required]],
      inventoryBranchManagerId: ['', [Validators.required]]
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
    this.goodsReceiptService.getCache().subscribe(
      (cached: any[]) => {
        this.goodsReceipts = cached;
      }
    );
  }

  getCarts(): void {
    this.cartService.getCache().subscribe(
      (cached: any[]) => {
        this.carts = cached;
      }
    );
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.getCache().subscribe(
      (cached: any[]) => {
        this.inventoryBranches = cached;
      }
    );
  }

  getInventoryBranchById(id: number): InventoryBranch | null {
    const found = this.inventoryBranches.find(data => data.inventoryBranchId === id);
    return found || null;
  }

  addGoodsReceipt(): void {
    const inventoryBranchId = this.goodsReceiptForm.get('inventoryBranchId')?.value;
    const date = this.goodsReceiptForm.get('date')?.value;
    const warehouseManagerId = this.goodsReceiptForm.get('warehouseManagerId')?.value;
    const inventoryBranchManagerId = this.goodsReceiptForm.get('inventoryBranchManagerId')?.value;

    this.goodsReceiptService.add({ inventoryBranchId, date, warehouseManagerId, inventoryBranchManagerId } as GoodsReceipt)
      .subscribe(goodsReceipt => {
        this.goodsReceiptForm.reset();
      });
  }

  deleteGoodsReceipt(goodsReceipt: GoodsReceipt): void {

    if (goodsReceipt) {
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
