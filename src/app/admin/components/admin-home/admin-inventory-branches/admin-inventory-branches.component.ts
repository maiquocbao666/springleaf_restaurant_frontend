import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { Ingredient } from './../../../../interfaces/ingredient';
import { AdminInventoryBranchDetailComponent } from './admin-inventory-branch-detail/admin-inventory-branch-detail.component';

@Component({
  selector: 'app-admin-inventory-branches',
  templateUrl: './admin-inventory-branches.component.html',
  styleUrls: ['./admin-inventory-branches.component.css']
})
export class AdminInventoryBranchesComponent {
  inventoryBranches: InventoryBranch[] = [];
  ingredients: Ingredient[] = [];
  restaurants: Restaurant[] = [];
  suppliers: Supplier[] = [];
  inventoryBranchForm: FormGroup;
  inventoryBranch: InventoryBranch | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];


  constructor(
    private inventoryBranchService: InventoryBranchService,
    private ingredientService: IngredientService,
    private supplierService: SupplierService,
    private restaurantService: RestaurantService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.inventoryBranchForm = this.formBuilder.group({
      inventoryBranchId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]],
      restaurantId: ['', [Validators.required]]
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
    this.getSuppliers();
    this.getRestaurants();
  }

  getInventoryBranches(): void {
    this.inventoryBranchService.inventoryBranchesCache$
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
  }

  getSuppliers(): void {
    this.supplierService.suppliersCache$
      .subscribe(suppliers => this.suppliers = suppliers);
  }

  getIngredients(): void {
    this.ingredientService.ingredientsCache$
      .subscribe(ingredients => this.ingredients = ingredients);
  }

  getRestaurants(): void {
    this.restaurantService.restaurantsCache$
      .subscribe(restaurants => this.restaurants = restaurants);
  }

  getIngredientById(ingredientId: number): Observable<Ingredient | null> {
    return this.ingredientService.getById(ingredientId);
  }

  getSupplierById(supplierId: number): Observable<Supplier | null> {
    return this.supplierService.getSupplierById(supplierId);
  }


  getRestaurantById(restaurantId: number): Observable<Restaurant | null> {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  addInventoryBranch(): void {

    const ingredientId = this.inventoryBranchForm.get('ingredientId')?.value;
    const supplierId = this.inventoryBranchForm.get('supplierId')?.value;
    const restaurantId = this.inventoryBranchForm.get('restaurantId')?.value;

    const newInventoryBranch: InventoryBranch = {
      ingredientId: ingredientId,
      supplierId: supplierId,
      restaurantId: restaurantId,
    };

    this.inventoryBranchService.add(newInventoryBranch)
      .subscribe(inventoryBranch => {
        this.inventoryBranchForm.reset();
      });
  }

  deleteInventoryBranch(inventoryBranch: InventoryBranch): void {

    if (inventoryBranch.inventoryBranchId) {
      this.inventoryBranches = this.inventoryBranches.filter(c => c !== inventoryBranch);
      this.inventoryBranchService.delete(inventoryBranch.inventoryBranchId).subscribe();
    } else {
      console.log("Không có inventoryBranchId");
    }


  }

  openInventoryBranchDetailModal(inventoryBranch: InventoryBranch) {
    const modalRef = this.modalService.open(AdminInventoryBranchDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventoryBranch = inventoryBranch;
    modalRef.componentInstance.inventoryBranchSaved.subscribe(() => {
    });
  }
}
