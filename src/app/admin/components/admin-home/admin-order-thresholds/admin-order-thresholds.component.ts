import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { OrderThreshold } from 'src/app/interfaces/order-threshold';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { OrderThresholdService } from 'src/app/services/order-threshold.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { AdminOrderThresholdDetailComponent } from './admin-order-threshold-detail/admin-order-threshold-detail.component';

@Component({
  selector: 'app-admin-order-thresholds',
  templateUrl: './admin-order-thresholds.component.html',
  styleUrls: ['./admin-order-thresholds.component.css']
})
export class AdminOrderThresholdsComponent {
  orderThreshold: OrderThreshold | undefined;
  orderThresholds: OrderThreshold[] = [];
  ingredients: Ingredient[] = [];
  inventoryBranches: InventoryBranch[] = [];
  inventories: Inventory[] = [];
  orderThresholdForm: FormGroup;

  inventoryBranchesUrl = 'inventoryBranches';
  ingredientsUrl = 'ingredients';
  orderThresholdsUrl = 'orderThresholds';
  inventoriesUrl = 'inventories';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private ingredientService: IngredientService,
    private orderThresholdService: OrderThresholdService,
    private inventoryBranchService: InventoryBranchService,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.orderThresholdForm = this.formBuilder.group({
      reorderPoint: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      inventoryBranchId: ['', [Validators.required]],
      inventoryId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getOrderThresholds();
    this.getIngredients();
    this.getInventoryBranches();
    this.getInventories();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getOrderThresholds();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getOrderThresholds();
  }

  getOrderThresholds(): void {
    this.orderThresholdService.getCache().subscribe(
      (cached: any[]) => {
        this.orderThresholds = cached;
      }
    );
  }

  getIngredients(): void {
    this.ingredientService.getCache().subscribe(
      (cached: any[]) => {
        this.ingredients = cached;
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

  getInventories(): void {
    this.inventoryService.getCache().subscribe(
      (cached: any[]) => {
        this.inventories = cached;
      }
    );
  }




  getInventoryById(id: number): Inventory | null {
    const found = this.inventories.find(data => data.inventoryId === id);
    return found || null;
  }

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  getInventoryBranchById(id: number): InventoryBranch | null {
    const found = this.inventoryBranches.find(data => data.inventoryBranchId === id);
    return found || null;
  }


  addOrderThreshold(): void {
    const reorderPoint = this.orderThresholdForm.get('reorderPoint')?.value;
    const ingredientId = this.orderThresholdForm.get('ingredientId')?.value;
    const inventoryBranchId = this.orderThresholdForm.get('inventoryBranchId')?.value;
    const inventoryId = this.orderThresholdForm.get('inventoryId')?.value;

    const newOrderThreshold: OrderThreshold = {
      reorderPoint: reorderPoint,
      ingredientId: ingredientId,
      inventoryBranchId: inventoryBranchId,
      inventoryId: inventoryId,
    };

    this.orderThresholdService.add(newOrderThreshold)
      .subscribe(orderThreshold => {
        // Reset form or perform any actions after successful addition
        this.orderThresholdForm.reset();
        this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada')

      });
  }


  deleteOrderThreshold(orderThreshold: OrderThreshold): void {
    if (orderThreshold.orderThresholdId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.orderThresholdService.delete(orderThreshold.orderThresholdId!).
              subscribe(() => {
                this.getOrderThresholds();
              }),
              Swal.fire('Đã xóa!', 'Bạn đã xóa.', 'success');
          }
        })
    } else {
      console.log('Không có orderThresholdId');
    }
  }

  openOrderThresholdDetailModal(orderThreshold: OrderThreshold) {
    const modalRef = this.modalService.open(AdminOrderThresholdDetailComponent, { size: 'lg' });
    modalRef.componentInstance.orderThreshold = orderThreshold;
    modalRef.componentInstance.orderThresholdSaved.subscribe(() => {
      this.getOrderThresholds(); // Có thể cần cập nhật lại danh sách sau khi lưu từ modal
    });
  }


}
