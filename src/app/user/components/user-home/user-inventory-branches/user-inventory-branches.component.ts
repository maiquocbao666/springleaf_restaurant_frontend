import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  inventoryBranch: InventoryBranch | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private inventoryBranchService: InventoryBranchService,
    private supplierService: SupplierService,
    private ingredientService: IngredientService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.inventoryBranchForm = this.formBuilder.group({
      // inventoryBranchId: ['', [Validators.required]],
      supplier: ['', [Validators.required]],
      ingredient: ['', [Validators.required]],
      restaurant: ['', [Validators.required]],
    });
  }


  onTableDataChange(event: any) {
    this.page = event;
    this.getInventoryBranches();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getInventoryBranches();
  }

  ngOnInit(): void {
    this.getInventoryBranches();
    this.getIngredients();
    this.getRestaurants();
    this.getSuppliers();
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.getInventoryBranches()
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }
  getRestaurants(): void {
    this.restaurantService.getRestaurants()
      .subscribe(restaurants => this.restaurants = restaurants);
  }
  getSuppliers(): void {
    this.supplierService.getSuppliers()
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  getIngredients(): void {
    this.ingredientService.getIngredients()
      .subscribe(ingredients => this.ingredients = ingredients);
  }

  getRestaurantById(restaurantId: number): Observable<Restaurant> {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  getIngredientById(ingredientId: number): Observable<Ingredient> {
    return this.ingredientService.getIngredient(ingredientId);
  }

  getSupplierById(supplierId: number): Observable<Supplier> {
    return this.supplierService.getSupplier(supplierId);
  }
}
