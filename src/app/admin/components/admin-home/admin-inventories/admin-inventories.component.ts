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

  inventoriesUrl = 'inventories';
  ingredientsUrl = 'ingredients';
  suppliersUrl = 'suppliers';

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


  getIngredientById(ingredientId: number): Observable<Ingredient | null> {
    return this.ingredientService.getById(ingredientId);
  }

  getSupplierById(supplierId: number): Observable<Supplier | null> {
    return this.supplierService.getById(supplierId);
  }

  getIngredients(): void {
    this.ingredientService.gets();
    this.ingredientService.cache$
      .subscribe(ingredients => {
        this.ingredientService.gets();
        this.ingredients = JSON.parse(localStorage.getItem(this.ingredientsUrl) || 'null')
      });
  }

  getInventories(): void {
    this.inventoryService.gets();
    this.inventoryService.cache$
      .subscribe(inventories => {
        this.inventoryService.gets();
        this.inventories = JSON.parse(localStorage.getItem(this.inventoriesUrl) || 'null')
      });
  }

  getSuppliers(): void { 
    this.supplierService.gets();
    this.supplierService.cache$
      .subscribe(suppliers => {
        this.supplierService.gets();
        this.suppliers = JSON.parse(localStorage.getItem(this.suppliersUrl) || 'null')
      });
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
