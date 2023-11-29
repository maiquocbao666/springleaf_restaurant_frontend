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

  restaurantsUrl = 'restaurants';
  ingredientsUrl = 'ingredients';
  suppliersUrl = 'suppliers';
  inventoryBranchesUrl = 'inventoryBranches';


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
    this.inventoryBranchService.getCache().subscribe(
      (cached: any[]) => {
        this.inventoryBranches = cached;
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

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  getSupplierById(id: number): Supplier | null {
    const found = this.suppliers.find(data => data.supplierId === id);
    return found || null;
  }


  getRestaurantById(id: number): Restaurant | null {
    const found = this.restaurants.find(data => data.restaurantId === id);
    return found || null;
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
