import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { Product } from 'src/app/interfaces/product';
import { IngredientService } from 'src/app/services/ingredient.service';
import { MenuItemIngredientService } from 'src/app/services/menu-Item-ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { AdminMenuItemIngredientDetailComponent } from '../admin-menu-item-ingredient-detail/admin-menu-item-ingredient-detail.component';
import { MenuItemIngredient } from './../../../../interfaces/menu-item-ingredient';

@Component({
  selector: 'app-admin-menu-item-ingredients',
  templateUrl: './admin-menu-item-ingredients.component.html',
  styleUrls: ['./admin-menu-item-ingredients.component.css']
})
export class AdminMenuItemIngredientsComponent {
  menuItemIngredients: MenuItemIngredient[] = [];
  menuItemIngredientForm: FormGroup;
  menuItemIngredient: MenuItemIngredient | undefined;
  products: Product[] = [];
  ingredients: Ingredient[] = [];
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  menuItemIngredientsUrl = 'menuItemIngredients';
  ingredientsUrl = 'ingredients';
  productsUrl = 'products';

  constructor(
    private menuItemIngredientService: MenuItemIngredientService,
    private productService: ProductService,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService
  ) {
    this.menuItemIngredientForm = this.formBuilder.group({
      menuItemId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getMenuItemIngredients();
    this.getIngredients();
    this.getProducts();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getMenuItemIngredients();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getMenuItemIngredients();
  }


  getMenuItemIngredients(): void {
    this.menuItemIngredientService.gets();
    this.menuItemIngredientService.cache$
      .subscribe(menuItemIngredients => {
        this.menuItemIngredientService.gets();
        this.menuItemIngredients = JSON.parse(localStorage.getItem(this.menuItemIngredientsUrl) || 'null')
      });
  }

  getProducts(): void {
    this.productService.gets();
    this.productService.cache$
      .subscribe(products => {
        this.productService.gets();
        this.products = JSON.parse(localStorage.getItem(this.productsUrl) || 'null')
      });
  }


  getIngredients(): void {
    this.ingredientService.gets();
    this.ingredientService.cache$
      .subscribe(ingredients => {
        this.ingredientService.gets();
        this.ingredients = JSON.parse(localStorage.getItem(this.ingredientsUrl) || 'null')
      });
  }


  getIngredientById(ingredientId: number): Observable<Ingredient | null> {
    return this.ingredientService.getById(ingredientId);
  }

  getProductById(menuItemId: number): Observable<Product | null> {
    return this.productService.getById(menuItemId);
  }

  addMenuItemIngredient(): void {
    const menuItemId = this.menuItemIngredientForm.get('menuItemId')?.value;
    const ingredientId = this.menuItemIngredientForm.get('ingredientId')?.value;
    const quantity = this.menuItemIngredientForm.get('quantity')?.value;

    const newMenuItemIngredient: MenuItemIngredient = {
      menuItemIngredientId: 0,
      menuItemId: menuItemId,
      ingredientId: ingredientId,
      quantity: quantity
    };

    this.menuItemIngredientService.add(newMenuItemIngredient)
      .subscribe(() => {
        this.getMenuItemIngredients(); // Sau khi thêm, cập nhật lại danh sách
        this.menuItemIngredientForm.reset();

        this.sweetAlertService.showCustomAnimatedAlert('Thêm thành công', 'success', 'animated tada')

      });
  }

  deleteMenuItemIngredient(menuItemIngredient: MenuItemIngredient): void {
    if (menuItemIngredient.menuItemIngredientId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa?', 'Không thể tải lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.menuItemIngredientService.delete(menuItemIngredient.menuItemIngredientId!)
              .subscribe(() => {
                this.getMenuItemIngredients(); // Sau khi xóa, cập nhật lại danh sách
              });
            Swal.fire('Đã xóa!', 'Bạn đã xóa.', 'success');
          }
        });
    } else {
      console.log("Không có menuItemIngredientId");
    }
  }

  openMenuItemIngredientDetailModal(menuItemIngredient: MenuItemIngredient) {
    const modalRef = this.modalService.open(AdminMenuItemIngredientDetailComponent, { size: 'lg' });
    modalRef.componentInstance.menuItemIngredient = menuItemIngredient;
    modalRef.componentInstance.menuItemIngredientSaved.subscribe(() => {
      this.getMenuItemIngredients(); // Có thể cần cập nhật lại danh sách sau khi lưu từ modal
    });
  }
}
