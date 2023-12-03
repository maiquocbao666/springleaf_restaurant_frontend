import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { OrderThreshold } from 'src/app/interfaces/order-threshold';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { OrderThresholdService } from 'src/app/services/order-threshold.service';
import { ToastService } from 'src/app/services/toast.service';

const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
@Component({
  selector: 'app-admin-order-threshold-detail',
  templateUrl: './admin-order-threshold-detail.component.html',
  styleUrls: ['./admin-order-threshold-detail.component.css']
})
export class AdminOrderThresholdDetailComponent {
  @Input() orderThreshold: OrderThreshold | undefined;
  @Output() orderThresholdSaved: EventEmitter<void> = new EventEmitter<void>();
  orderThresholds: OrderThreshold[] = [];
  ingredients: Ingredient[] = [];
  inventoryBranches: InventoryBranch[] = [];
  inventories: Inventory[] = [];
  orderThresholdForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  inventoryBranchesUrl = 'inventoryBranches';
  ingredientsUrl = 'ingredients';
  orderThresholdsUrl = 'orderThresholds';
  inventoriesUrl = 'inventories';



  constructor(
    private ingredientService: IngredientService,
    private orderThresholdService: OrderThresholdService,
    private inventoryBranchService: InventoryBranchService,
    private inventoryService: InventoryService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    public activeModal: NgbActiveModal,
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
    this.setValue();
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

  setValue(): void {
    if (this.orderThreshold) {
      this.orderThresholdForm.patchValue({
        orderThresholdId: this.orderThreshold.orderThresholdId,
        reorderPoint: this.orderThreshold.reorderPoint,
        ingredientId: this.orderThreshold.ingredientId,
        inventoryBranchId: this.orderThreshold.inventoryBranchId,
        inventoryId: this.orderThreshold.inventoryId,
      });
    }
  }
  updateOrderThreshold(): void {
    // Đóng modal sau khi lưu

    this.isSubmitted = true;

    if (this.orderThresholdForm.valid) {
      const updatedOrderThreshold: OrderThreshold = {
        orderThresholdId: +this.orderThresholdForm.get('orderThresholdId')?.value,
        reorderPoint: +this.orderThresholdForm.get('reorderPoint')?.value,
        ingredientId: +this.orderThresholdForm.get('ingredientId')?.value,
        inventoryBranchId: +this.orderThresholdForm.get('inventoryBranchId')?.value,
        inventoryId: +this.orderThresholdForm.get('inventoryId')?.value,
      };

      this.orderThresholdService.update(updatedOrderThreshold).subscribe(
        () => {
          this.sweetAlertService.showCustomAnimatedAlert('Cập nhật thành công', 'success', 'animated tada');
          this.activeModal.close('Close after saving');
        },
        (error) => {
          this.sweetAlertService.showCustomAnimatedAlert('Cập nhật thất bại', 'warning', 'animated shake');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Cập nhật không thành công', 'warning', 'animated shake');
    }
  }

}
