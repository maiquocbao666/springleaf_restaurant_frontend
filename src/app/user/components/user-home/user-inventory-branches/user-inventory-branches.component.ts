import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { Ingredient } from './../../../../interfaces/ingredient';

@Component({
  selector: 'app-user-inventory-branches',
  templateUrl: './user-inventory-branches.component.html',
  styleUrls: ['./user-inventory-branches.component.css']
})
export class UserInventoryBranchesComponent {
  inventoryBranches: InventoryBranch[] = [];
  restaurants: Restaurant[] = [];
  suppliers: Supplier[] = [];
  ingredients: Ingredient[] = [];
  inventoryBranchForm: FormGroup;
  inventoryBranch!: InventoryBranch;
  fieldNames: string[] = [];

  inventoryBranchesUrl = 'inventoryBranches';
  restaurantsUrl = 'restaurants';
  suppliersUrl = 'suppliers';
  ingredientsUrl = 'ingredients';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private inventoryBranchService: InventoryBranchService,
    private supplierService: SupplierService,
    private ingredientService: IngredientService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder
  ) {
    this.inventoryBranchForm = this.formBuilder.group({
      // inventoryBranchId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]],
    });
  }


  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  ngOnInit(): void {
    this.getInventoryBranches();
    this.getIngredients();
    this.getRestaurants();
    this.getSuppliers();
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.getCache().subscribe(
      (cached: any[]) => {
        this.inventoryBranches = cached;
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
  getSuppliers(): void {
    this.supplierService.getCache().subscribe(
      (cached: any[]) => {
        this.suppliers = cached;
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

  getRestaurantById(id: number): Restaurant | null {
    const found = this.restaurants.find(data => data.restaurantId === id);
    return found || null;
  }

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  getSupplierById(id: number): Supplier | null {
    const found = this.suppliers.find(data => data.supplierId === id);
    return found || null;
  }
}
