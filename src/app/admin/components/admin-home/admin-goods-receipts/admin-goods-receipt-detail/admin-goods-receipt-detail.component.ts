import { Component, Input, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GoodsReceipt } from 'src/app/interfaces/goods-receipt';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';

@Component({
  selector: 'app-admin-goods-receipt-detail',
  templateUrl: './admin-goods-receipt-detail.component.html',
  styleUrls: ['./admin-goods-receipt-detail.component.css']
})
export class AdminGoodsReceiptDetailComponent {
  @Input() goodsReceipt: GoodsReceipt | undefined;
  goodsReceipts: GoodsReceipt[] = [];
  inventoryBranches: InventoryBranch[] = [];
  fieldNames: string[] = [];
  goodsReceiptForm: FormGroup;

  constructor(
    private inventoryBranchService: InventoryBranchService,
    private goodsReceiptService: GoodsReceiptService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private zone: NgZone
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.goodsReceiptForm = this.formBuilder.group({
      goodsReceiptId: ['', [Validators.required]],
      inventoryBrand: ['', [Validators.required]],
      date: ['', [Validators.required]],
      warehouseManager: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getInventoryBranches();
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.getInventoryBranches()
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }

  setValue() {
    if (this.goodsReceipt) {
      const formattedDate = new Date(this.goodsReceipt.date).toISOString().slice(0, 10);
      this.goodsReceiptForm.patchValue({
        goodsReceiptId: this.goodsReceipt.goodsReceiptId,
        inventoryBrand: this.goodsReceipt.inventoryBrand,
        date: formattedDate, // Gán giá trị date đã được chuyển đổi
        warehouseManager: this.goodsReceipt.warehouseManager,
        user: this.goodsReceipt.user,
      });
    }
  }

  updateGoodsReceipt(): void {
    this.activeModal.close('Close after saving');
    if (this.goodsReceiptForm.valid) {
      const updatedGoodsReceipt: GoodsReceipt = {
        goodsReceiptId: this.goodsReceiptForm.get('goodsReceiptId')?.value,
        inventoryBrand: this.goodsReceiptForm.get('inventoryBrand')?.value,
        date: this.goodsReceiptForm.get('date')?.value,
        warehouseManager: this.goodsReceiptForm.get('warehouseManager')?.value,
        user: this.goodsReceiptForm.get('user')?.value,
      };

      this.goodsReceiptService.updateGoodsReceipt(updatedGoodsReceipt).subscribe(() => {
        // Cập nhật cache
        this.goodsReceiptService.updateGoodsReceiptCache(updatedGoodsReceipt);
      });
    }
  }

}
