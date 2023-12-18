import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { InventoryBranchIngredient } from 'src/app/interfaces/inventoryBranch-ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { InventoryBranchIngredientService } from 'src/app/services/inventoryBranchIngredient.service';
import { ToastService } from 'src/app/services/toast.service';
const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
@Component({
  selector: 'app-admin-inventory-branch-ingredient-detail',
  templateUrl: './admin-inventory-branch-ingredient-detail.component.html',
  styleUrls: ['./admin-inventory-branch-ingredient-detail.component.css']
})
export class AdminInventoryBranchIngredientDetailComponent {
  inventories: Inventory[] = [];
  inventoryBranchIngredients: InventoryBranchIngredient[] = [];
  ingredients: Ingredient[] = [];
  inventoryBranches: InventoryBranch[] = [];
  inventoryBranchIngredientForm: FormGroup;
  inventory: Inventory | undefined;
  @Input() inventoryBranchIngredient: InventoryBranchIngredient | undefined;
  @Output() inventoryBranchIngredientSaved: EventEmitter<void> = new EventEmitter<void>();
  fieldNames: string[] = [];
  isSubmitted = false;

  constructor(
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private inventoryBranchService: InventoryBranchService,
    private inventoryBranchIngredientService: InventoryBranchIngredientService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService,
    public activeModal: NgbActiveModal

  ) {
    this.inventoryBranchIngredientForm = this.formBuilder.group({
      inventoryBranchIngredientId: ['', [Validators.required]],
      inventoryId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      quantity: ['', [Validators.required, nonNegativeNumberValidator]],
      inventoryBranchId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getIngredients();
    this.getInventories();
    this.getInventoryBranches();
  }

  setValue() {
    if (this.inventoryBranchIngredient) {
      this.inventoryBranchIngredientForm.patchValue({
        inventoryBranchIngredientId: this.inventoryBranchIngredient.inventoryBranchIngredientId,
        ingredientId: this.inventoryBranchIngredient.ingredientId,
        inventoryId: this.inventoryBranchIngredient.inventoryId,
        quantity: this.inventoryBranchIngredient.quantity,
        inventoryBranchId: this.inventoryBranchIngredient.inventoryBranchId,
      });
    }
  }

  getIngredients(): void {
    this.ingredientService.getCache().subscribe(
      (cached: any[]) => {
        this.ingredients = cached;
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

  getInventoryBranches(): void {
    this.inventoryBranchService.getCache().subscribe(
      (cached: any[]) => {
        this.inventoryBranches = cached;
      }
    );
  }

  updateInventoryBranchIngredient(): void {
    // Đóng modal sau khi lưu
    this.activeModal.close('Close after saving');
    this.isSubmitted = true;
  
    if (this.inventoryBranchIngredientForm.valid) {
      const updatedInventoryBranchIngredient: InventoryBranchIngredient = {
        inventoryBranchIngredientId: +this.inventoryBranchIngredientForm.get('inventoryBranchIngredientId')?.value,
        ingredientId: +this.inventoryBranchIngredientForm.get('ingredientId')?.value,
        inventoryId: +this.inventoryBranchIngredientForm.get('inventoryId')?.value,
        quantity: +this.inventoryBranchIngredientForm.get('quantity')?.value,
        inventoryBranchId: +this.inventoryBranchIngredientForm.get('inventoryBranchId')?.value,
      };
  
      this.inventoryBranchIngredientService.update(updatedInventoryBranchIngredient).subscribe(
        () => {
          this.sweetAlertService.showCustomAnimatedAlert('Cập nhật thành công', 'success', 'animated tada');
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
