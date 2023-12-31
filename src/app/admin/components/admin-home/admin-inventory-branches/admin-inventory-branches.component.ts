import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryBranch } from 'src/app/interfaces/inventory-branch';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { Supplier } from 'src/app/interfaces/supplier';
import { IngredientService } from 'src/app/services/ingredient.service';
import { InventoryBranchService } from 'src/app/services/inventory-branch.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ToastService } from 'src/app/services/toast.service';
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
  inventoryBranch!: InventoryBranch;
  fieldNames: string[] = [];
  isSubmitted = false;


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
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.inventoryBranchForm = this.formBuilder.group({
      // inventoryBranchId: ['', [Validators.required]],
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
    this.isSubmitted = true;
    if (this.inventoryBranchForm.valid) {
      const ingredientId = this.inventoryBranchForm.get('ingredientId')?.value;
      const supplierId = this.inventoryBranchForm.get('supplierId')?.value;
      const restaurantId = this.inventoryBranchForm.get('restaurantId')?.value;

      const newInventoryBranch: InventoryBranch = {
        ingredientId: ingredientId,
        supplierId: supplierId,
        restaurantId: restaurantId,
      };

      this.inventoryBranchService.add(newInventoryBranch)
        .subscribe(
          () => {
            this.inventoryBranchForm.reset();
            this.isSubmitted = false;
            this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada');
          },
          (error) => {
            this.sweetAlertService.showCustomAnimatedAlert('Thất bại, không thể thêm', 'warning', 'animated tada');
            console.error('Lỗi khi thêm:', error);
          }
        );
    } else {
      this.sweetAlertService.showCustomAnimatedAlert('Thất bại, chưa nhập đủ dữ liệu', 'warning', 'animated tada');
    }
  }
  deleteInventoryBranch(inventoryBranch: InventoryBranch): void {
    if (inventoryBranch.inventoryBranchId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa chi nhánh kho?', 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.inventoryBranches = this.inventoryBranches.filter(c => c !== inventoryBranch);
            this.inventoryBranchService.delete(inventoryBranch.inventoryBranchId!)
              .subscribe(() => {
                this.sweetAlertService.fireAlert('Đã xóa!', 'Bạn đã xóa chi nhánh kho thành công', 'success');
              },
                error => {
                  this.sweetAlertService.fireAlert('Lỗi khi xóa!', 'Đã xảy ra lỗi khi xóa chi nhánh kho', 'error');
                  console.error('Lỗi khi xóa chi nhánh kho:', error);
                });
          }
        });
    } else {
      this.sweetAlertService.fireAlert('Không có inventoryBranchId!', 'Không có inventoryBranchId để xóa.', 'info');
    }
  }


  openInventoryBranchDetailModal(inventoryBranch: InventoryBranch) {
    const modalRef = this.modalService.open(AdminInventoryBranchDetailComponent, { size: 'lg' });
    modalRef.componentInstance.inventoryBranch = inventoryBranch;
    modalRef.componentInstance.inventoryBranchSaved.subscribe(() => {
    });
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getInventoryBranches();
    } else {
      this.inventoryBranchService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.inventoryBranches = data;
        }
      );
    }
  }

  fieldName!: keyof InventoryBranch;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any){
    this.keywords = event.target.value;
    this.search();
  }

}
