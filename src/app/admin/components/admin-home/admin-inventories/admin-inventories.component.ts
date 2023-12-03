import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ToastService } from 'src/app/services/toast.service';
import { AdminInventoryDetailComponent } from './admin-inventory-detail/admin-inventory-detail.component';

@Component({
  selector: 'app-admin-inventories',
  templateUrl: './admin-inventories.component.html',
  styleUrls: ['./admin-inventories.component.css']
})
export class AdminInventoriesComponent {
  inventories: Inventory[] = [];
  ingredients: Ingredient[] = [];
  suppliers: Supplier[] = [];
  inventoryForm: FormGroup;
  inventory: Inventory | undefined;
  fieldNames: string[] = [];
  isSubmitted = false;

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  inventoriesUrl = 'inventories';
  ingredientsUrl = 'ingredients';
  suppliersUrl = 'suppliers';

  constructor(
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService

  ) {
    this.inventoryForm = this.formBuilder.group({
      // inventoryId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getInventories();
    this.getIngredients();
    this.getSuppliers();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getInventories();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }


  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  getSupplierById(id: number): Supplier | null {
    const found = this.suppliers.find(data => data.supplierId === id);
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

  getSuppliers(): void {
    this.supplierService.getCache().subscribe(
      (cached: any[]) => {
        this.suppliers = cached;
      }
    );
  }
  addInventory(): void {
    this.isSubmitted = true;
    if (this.inventoryForm.valid) {
      const ingredientId = this.inventoryForm.get('ingredientId')?.value;
      const supplierId = this.inventoryForm.get('supplierId')?.value;

      const newInventory: Inventory = {
        ingredientId: ingredientId,
        supplierId: supplierId
      };

      this.inventoryService.add(newInventory)
        .subscribe(
          () => {
            this.inventoryForm.reset();
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

  deleteInventory(inventory: Inventory): void {
    if (inventory.inventoryId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.inventories = this.inventories.filter(i => i !== inventory);
            this.inventoryService.delete(inventory.inventoryId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa thành công', 'success');
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa', 'error');
                  console.error('Lỗi khi xóa inventory:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có inventoryId!', 'Không có inventoryId để xóa.', 'info');
    }
  }

  openInventoryDetailModal(inventory: Inventory) {
    const modalRef = this.modalService.open(AdminInventoryDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventory = inventory;
    modalRef.componentInstance.inventorySaved.subscribe(() => {
    });
  }
}
