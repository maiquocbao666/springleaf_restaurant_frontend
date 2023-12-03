import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Inventory } from 'src/app/interfaces/inventory';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { SupplierService } from 'src/app/services/supplier.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-inventory-detail',
  templateUrl: './admin-inventory-detail.component.html',
  styleUrls: ['./admin-inventory-detail.component.css']
})
export class AdminInventoryDetailComponent implements OnInit {
  @Input() inventory: Inventory | undefined;
  @Output() inventorySaved: EventEmitter<void> = new EventEmitter<void>();
  inventoryForm: FormGroup;
  inventoris: Inventory[] = [];
  suppliers: Supplier[] = [];
  ingredients: Ingredient[] = [];
  fieldNames: string[] = [];
  inventories: Inventory[] = [];
  isSubmitted = false;

  inventoriesUrl = 'inventories';
  ingredientsUrl = 'ingredients';
  suppliersUrl = 'suppliers';

  constructor(
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.inventoryForm = this.formBuilder.group({
      inventoryId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]]

    });
  }
  ngOnInit(): void {
    this.getSuppliers();
    this.getIngredients();
    this.setValue();

  }

  setValue() {
    if (this.inventory) {
      this.inventoryForm.patchValue({
        inventoryId: this.inventory.inventoryId,
        ingredientId: this.inventory.ingredientId,
        supplierId: this.inventory.supplierId
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

  getSuppliers(): void {
    this.supplierService.getCache().subscribe(
      (cached: any[]) => {
        this.suppliers = cached;
      }
    );
  }



  updateInventory(): void {
    this.isSubmitted = true;
  
    if (this.inventoryForm.valid) {
      const updatedInventory: Inventory = {
        inventoryId: +this.inventoryForm.get('inventoryId')?.value,
        ingredientId: +this.inventoryForm.get('ingredientId')?.value,
        supplierId: +this.inventoryForm.get('supplierId')?.value
      };
  
      this.inventoryService.update(updatedInventory).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.inventoryForm.reset();
          // Cập nhật cache
        },
        (error) => {
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'warning');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      Swal.fire('Thất bại', 'Cập nhật không thành công!', 'warning');
    }
  }
  
}
