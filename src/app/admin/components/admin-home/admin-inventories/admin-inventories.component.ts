import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SupplierService } from 'src/app/services/supplier.service';
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

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private inventoryService: InventoryService,
    private ingredientService: IngredientService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.inventoryForm = this.formBuilder.group({
      inventoryId: ['', [Validators.required]],
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

  getIngredients(): void {
    this.ingredientService.cache$
      .subscribe(ingredients => this.ingredients = ingredients);
  }

  getIngredientById(ingredientId: number): Observable<Ingredient | null> {
    return this.ingredientService.getById(ingredientId);
  }

  getSupplierById(supplierId: number): Observable<Supplier | null> {
    return this.supplierService.getById(supplierId);
  }

  getInventories(): void {
    this.inventoryService.cache$
      .subscribe(inventories => this.inventories = inventories);
  }

  getSuppliers(): void {
    this.supplierService.cache$
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  addInventory(): void {
    // Lấy giá trị từ các trường select
    const ingredientId = this.inventoryForm.get('ingredientId')?.value;
    const supplierId = this.inventoryForm.get('supplierId')?.value;

    // Kiểm tra xem người dùng đã chọn giá trị hợp lệ cho cả hai trường chưa
    if (!ingredientId && !supplierId) {
      alert('Vui lòng chọn cả nguyên liệu và nhà cung cấp.');
      return;
    }

    const newInventory: Inventory = {
      ingredientId: ingredientId,
      supplierId: supplierId
    };

    this.inventoryService.add(newInventory)
      .subscribe(inventory => {
        this.inventoryForm.reset();
      });

  }
  deleteInventory(inventory: Inventory): void {

    if (inventory.inventoryId) {
      this.inventories = this.inventories.filter(i => i !== inventory);
      this.inventoryService.delete(inventory.inventoryId).subscribe();
    } else {
      console.log("Không có inventoryId");
    }


  }
  openInventoryDetailModal(inventory: Inventory) {
    const modalRef = this.modalService.open(AdminInventoryDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventory = inventory;
    modalRef.componentInstance.inventorySaved.subscribe(() => {
    });
  }
}
