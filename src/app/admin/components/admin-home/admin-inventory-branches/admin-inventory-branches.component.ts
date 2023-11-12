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
      supplier: ['', [Validators.required]],
      restaurant: ['', [Validators.required]]
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
    this.inventoryBranchService.getInventoryBranches()
      .subscribe(inventoryBranches => this.inventoryBranches = inventoryBranches);
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

  getIngredientById(ingredientId: number): Observable<Ingredient> {
    return this.ingredientService.getIngredientById(ingredientId);
  }

  getSupplierById(supplierId: number): Observable<Supplier> {
    return this.supplierService.getSupplierById(supplierId);
  }

  getRestaurantById(restaurantId: number): Observable<Restaurant> {
    return this.restaurantService.getRestaurantById(restaurantId);
  }

  addInventoryBranch(): void {

    const ingredientId = this.inventoryBranchForm.get('ingredient')?.value;
    const supplier = this.inventoryBranchForm.get('supplier')?.value;
    const restaurant = this.inventoryBranchForm.get('restaurant')?.value;
    this.inventoryBranchService.addInventoryBranch({ ingredientId, supplier, restaurant } as InventoryBranch)
      .subscribe(inventoryBranch => {
        this.inventoryBranches.push(inventoryBranch);
        this.inventoryBranchForm.reset();
      });
  }

  deleteInventoryBranch(inventoryBranch: InventoryBranch): void {
    this.inventoryBranches = this.inventoryBranches.filter(c => c !== inventoryBranch);
    this.inventoryBranchService.deleteInventoryBranch(inventoryBranch.inventoryBranchId).subscribe();
  }

  openInventoryBranchDetailModal(inventoryBranch: InventoryBranch) {
    const modalRef = this.modalService.open(AdminInventoryBranchDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventoryBranch = inventoryBranch;

  }
}
