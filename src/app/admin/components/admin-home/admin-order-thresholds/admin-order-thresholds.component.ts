import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AdminOrderThresholdDetailComponent } from './admin-order-threshold-detail/admin-order-threshold-detail.component';

const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
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
  isSubmitted = false;

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
      reorderPoint: ['', [Validators.required, nonNegativeNumberValidator]],
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
    this.isSubmitted = true;
    if (this.orderThresholdForm.valid) {
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
        .subscribe(
          () => {
            this.orderThresholdForm.reset();
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


  deleteOrderThreshold(orderThreshold: OrderThreshold): void {
    if (orderThreshold.orderThresholdId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.orderThresholdService.delete(orderThreshold.orderThresholdId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa order threshold thành công', 'success');
                this.getOrderThresholds(); // Gọi hàm lấy order thresholds sau khi xóa
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa order threshold', 'error');
                  console.error('Lỗi khi xóa order threshold:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có orderThresholdId!', 'Không có orderThresholdId để xóa.', 'info');
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
