import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cart } from 'src/app/interfaces/cart';
import { GoodsReceipt } from 'src/app/interfaces/goods-receipt';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { CartService } from 'src/app/services/cart.service';
import { GoodsReceiptService } from 'src/app/services/goods-receipt.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';

@Component({
  selector: 'app-admin-goods-receipt-detail',
  templateUrl: './admin-goods-receipt-detail.component.html',
  styleUrls: ['./admin-goods-receipt-detail.component.css']
})
export class AdminGoodsReceiptDetailComponent {
  @Input() goodsReceipt: GoodsReceipt | undefined;
  @Output() goodsReceiptSaved: EventEmitter<void> = new EventEmitter<void>();
  goodsReceipts: GoodsReceipt[] = [];
  carts: Cart[] = [];
  inventoryBranches: InventoryBranch[] = [];
  fieldNames: string[] = [];
  goodsReceiptForm: FormGroup;

  cartsUrl = 'Carts';
  goodsReceiptsUrl = 'GoodsReceipts';
  inventoryBranchesUrl = 'InventoryBranches';


  constructor(
    private inventoryBranchService: InventoryBranchService,
    private goodsReceiptService: GoodsReceiptService,
    private cartService: CartService,
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

  getGoodsReceipts(): void {
    this.goodsReceiptService.gets();
    this.goodsReceiptService.cache$
      .subscribe(goodsReceipts => this.goodsReceipts = JSON.parse(localStorage.getItem(this.goodsReceiptsUrl) || 'null'));
  }

  getCarts(): void {
    this.cartService.gets();
    this.cartService.cache$
      .subscribe(carts => this.carts = JSON.parse(localStorage.getItem(this.cartsUrl) || 'null'));
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.gets();
    this.inventoryBranchService.cache$
      .subscribe(inventoryBranches => this.inventoryBranches = JSON.parse(localStorage.getItem(this.inventoryBranchesUrl) || 'null'));
  }

  setValue() {
    if (this.goodsReceipt) {
      const formattedDate = new Date(this.goodsReceipt.date).toISOString().slice(0, 10);
      this.goodsReceiptForm.patchValue({
        goodsReceiptId: this.goodsReceipt.goodsReceiptId,
        inventoryBranch: this.goodsReceipt.inventoryBranch,
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
        goodsReceiptId: +this.goodsReceiptForm.get('goodsReceiptId')?.value,
        inventoryBranch: +this.goodsReceiptForm.get('inventoryBranch')?.value,
        date: this.goodsReceiptForm.get('date')?.value,
        warehouseManager: +this.goodsReceiptForm.get('warehouseManager')?.value,
        user: +this.goodsReceiptForm.get('user')?.value,
      };

      this.goodsReceiptService.update(updatedGoodsReceipt).subscribe(() => {
      });
    }
  }

}
