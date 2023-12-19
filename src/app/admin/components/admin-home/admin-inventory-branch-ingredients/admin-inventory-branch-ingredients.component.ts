import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { InventoryBranchIngredient } from 'src/app/interfaces/inventoryBranch-ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { InventoryBranchIngredientService } from 'src/app/services/inventoryBranchIngredient.service';
import { ToastService } from 'src/app/services/toast.service';
import { AdminInventoryBranchIngredientDetailComponent } from './admin-inventory-branch-ingredient-detail/admin-inventory-branch-ingredient-detail.component';


const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};
@Component({
  selector: 'app-admin-inventory-branch-ingredients',
  templateUrl: './admin-inventory-branch-ingredients.component.html',
  styleUrls: ['./admin-inventory-branch-ingredients.component.css']
})
export class AdminInventoryBranchIngredientsComponent {
  inventories: Inventory[] = [];
  inventoryBranchIngredients: InventoryBranchIngredient[] = [];
  ingredients: Ingredient[] = [];
  inventoryBranches: InventoryBranch[] = [];
  inventoryBranchIngredientForm: FormGroup;
  inventory: Inventory | undefined;
  fieldNames: string[] = [];
  isSubmitted = false;

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  inventoryBranchIngredientsUrl = 'inventoryBranchIngredients';
  ingredientsUrl = 'inventoryBranchIngredients';
  inventoryBranchsUrl = 'inventoryBranchs';


  constructor(
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private inventoryBranchService: InventoryBranchService,
    private inventoryBranchIngredientService: InventoryBranchIngredientService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService

  ) {
    this.inventoryBranchIngredientForm = this.formBuilder.group({
      inventoryId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      quantity: ['', [Validators.required, nonNegativeNumberValidator]],
      inventoryBranchId: ['', [Validators.required]]
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getInventoryBranchIngredients();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getInventoryBranchIngredients(): void {
    this.inventoryBranchIngredientService.getCache().subscribe(
      (cached: any[]) => {
        this.inventoryBranchIngredients = cached;
      }
    );
  }

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
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

  ngOnInit(): void {
    this.getInventoryBranchIngredients();
    this.getIngredients();
    this.getInventories();
    this.getInventoryBranches();
  }

  addInventoryBranchIngredient(): void {
    this.isSubmitted = true;
    if (this.inventoryBranchIngredientForm.valid) {
      const inventoryBranchIngredientId = this.inventoryBranchIngredientForm.get('inventoryBranchIngredientId')?.value;
      const ingredientId = this.inventoryBranchIngredientForm.get('ingredientId')?.value;
      const inventoryId = this.inventoryBranchIngredientForm.get('inventoryId')?.value;
      const quantity = this.inventoryBranchIngredientForm.get('quantity')?.value;
      const inventoryBranchId = this.inventoryBranchIngredientForm.get('inventoryBranchId')?.value;

      const newInventoryBranchIngredient: InventoryBranchIngredient = {
        inventoryBranchIngredientId: inventoryBranchIngredientId,
        ingredientId: ingredientId,
        inventoryId: inventoryId,
        quantity: quantity,
        inventoryBranchId: inventoryBranchId,
      };

      this.inventoryBranchIngredientService.add(newInventoryBranchIngredient)
        .subscribe(
          () => {
            this.inventoryBranchIngredientForm.reset();
            this.isSubmitted = false;
            // Thực hiện các hành động sau khi thêm thành công, nếu cần
            // Ví dụ: Hiển thị thông báo thành công
            this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
          },
          (error) => {
            // Nếu có lỗi, hiển thị thông báo lỗi mà không thực hiện bất kỳ hành động nào khác
            this.sweetAlertService.showCustomAnimatedAlert('Thất bại, không thể thêm', 'warning', 'animated tada');
            console.error('Lỗi khi thêm:', error);
          }
        );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại, chưa nhập đủ dữ liệu', 'warning', 'animated tada');
    }
  }


  deleteInventoryBranchIngredient(inventoryBranchIngredient: InventoryBranchIngredient): void {
    if (inventoryBranchIngredient.inventoryBranchIngredientId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.inventoryBranchIngredientService.delete(inventoryBranchIngredient.inventoryBranchIngredientId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa thành công', 'success');
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa', 'error');
                  console.error('Lỗi khi xóa InventoryBranchIngredient:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có inventoryBranchIngredientId!', 'Không có ID để xóa.', 'info');
    }
  }


  openInventoryDetailModal(inventoryBranchIngredient: InventoryBranchIngredient) {
    const modalRef = this.modalService.open(AdminInventoryBranchIngredientDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventoryBranchIngredient = inventoryBranchIngredient;
    modalRef.componentInstance.inventoryBranchIngredientSaved.subscribe(() => {
    });
  }

}
