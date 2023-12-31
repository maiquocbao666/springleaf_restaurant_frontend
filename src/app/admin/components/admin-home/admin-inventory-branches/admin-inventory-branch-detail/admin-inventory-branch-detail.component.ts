import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-inventory-branch-detail',
  templateUrl: './admin-inventory-branch-detail.component.html',
  styleUrls: ['./admin-inventory-branch-detail.component.css']
})
export class AdminInventoryBranchDetailComponent implements OnInit {
  @Input() inventoryBranch: InventoryBranch | undefined;
  @Output() inventoryBranchSaved: EventEmitter<void> = new EventEmitter<void>();
  inventoryBranches: InventoryBranch[] = [];
  ingredients: Ingredient[] = [];
  restaurants: Restaurant[] = [];
  suppliers: Supplier[] = [];
  inventoryBranchForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  restaurantsUrl = 'restaurants';
  ingredientsUrl = 'ingredients';
  suppliersUrl = 'suppliers';

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
      supplierId: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setValue();
    this.getIngredients();
    this.getRestaurants();
    this.getSuppliers();
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

  getRestaurants(): void {
    this.restaurantService.getCache().subscribe(
      (cached: any[]) => {
        this.restaurants = cached;
      }
    );
  }

  setValue() {
    if (this.inventoryBranch) {
      this.inventoryBranchForm.patchValue({
        inventoryBranchId: this.inventoryBranch.inventoryBranchId,
        ingredientId: this.inventoryBranch.ingredientId,
        supplierId: this.inventoryBranch.supplierId,
        restaurantId: this.inventoryBranch.restaurantId,
      });
    }
  }

  updateInventoryBranch(): void {
    this.isSubmitted = true;
  
    if (this.inventoryBranchForm.valid) {
      const updateInventoryBranch: InventoryBranch = {
        inventoryBranchId: +this.inventoryBranchForm.get('inventoryBranchId')?.value,
        ingredientId: +this.inventoryBranchForm.get('ingredientId')?.value,
        supplierId: +this.inventoryBranchForm.get('supplierId')?.value,
        restaurantId: +this.inventoryBranchForm.get('restaurantId')?.value
      };
  
      this.inventoryBranchService.update(updateInventoryBranch).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.inventoryBranchForm.reset();
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
