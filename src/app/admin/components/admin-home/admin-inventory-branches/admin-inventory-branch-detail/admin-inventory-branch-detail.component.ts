import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
  selector: 'app-admin-inventory-branch-detail',
  templateUrl: './admin-inventory-branch-detail.component.html',
  styleUrls: ['./admin-inventory-branch-detail.component.css']
})
export class AdminInventoryBranchDetailComponent {
  @Input() inventoryBranch: InventoryBranch | undefined;
  inventoryBranches: InventoryBranch[] = [];
  ingredients: Ingredient[] = [];
  restaurants: Restaurant[] = [];
  suppliers: Supplier[] = [];
  inventoryBranchForm: FormGroup;
  fieldNames: string[] = [];


  constructor(
    private inventoryBranchService: InventoryBranchService,
    private ingredientService: IngredientService,
    private supplierService: SupplierService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.inventoryBranchForm = this.formBuilder.group({
      inventoryBranchId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      restaurant: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getIngredients();
    this.getRestaurants();
    this.getSuppliers();
  }


  getSuppliers(): void {
    this.supplierService.getSuppliers()
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  getIngredients(): void {
    this.ingredientService.getIngredients()
      .subscribe(ingredients => this.ingredients = ingredients);
  }

  getRestaurants(): void {
    this.restaurantService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  setValue() {
    if (this.inventoryBranch) {
      this.inventoryBranchForm.patchValue({
        inventoryBranchId: this.inventoryBranch.inventoryBranchId,
        ingredient: this.inventoryBranch.ingredientId,
        supplier: this.inventoryBranch.supplier,
        restaurant: this.inventoryBranch.restaurant,
      });
    }
  }

  updateInventoryBranch(): void {
    this.activeModal.close('Close after saving');
    if (this.inventoryBranchForm.valid) {
      const updateInventoryBranch: InventoryBranch = {
        inventoryBranchId: this.inventoryBranchForm.get('inventoryBranchId')?.value,
        ingredientId: this.inventoryBranchForm.get('ingredient')?.value,
        supplier: this.inventoryBranchForm.get('supplier')?.value,
        restaurant: this.inventoryBranchForm.get('restaurant')?.value
      };

      this.inventoryBranchService.updateInventoryBranch(updateInventoryBranch).subscribe(() => {
        // Cập nhật cache
        this.inventoryBranchService.updateInventoryBranchCache(updateInventoryBranch);
      });
    }
  }
}
