import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { MenuItemIngredient } from 'src/app/interfaces/menu-item-ingredient';
import { Product } from 'src/app/interfaces/product';
import { IngredientService } from 'src/app/services/ingredient.service';
import { MenuItemIngredientService } from 'src/app/services/menu-Item-ingredient.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

const nonNegativeNumberValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
  if (control.value < 0) {
    return { nonNegative: true };
  }
  return null;
};

@Component({
  selector: 'app-admin-menu-item-ingredient-detail',
  templateUrl: './admin-menu-item-ingredient-detail.component.html',
  styleUrls: ['./admin-menu-item-ingredient-detail.component.css']
})
export class AdminMenuItemIngredientDetailComponent implements OnInit {
  @Input() menuItemIngredient: MenuItemIngredient | undefined;
  @Output() menuItemIngredientSaved: EventEmitter<void> = new EventEmitter<void>();
  menuItemIngredients: MenuItemIngredient[] = [];
  ingredients: Ingredient[] = [];
  products: Product[] = [];
  menuItemIngredientForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  menuItemIngredientsUrl = 'menuItemIngredients';
  ingredientsUrl = 'ingredients';
  productsUrl = 'products';


  constructor(
    private menuItemIngredientService: MenuItemIngredientService,
    private productService: ProductService,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.menuItemIngredientForm = this.formBuilder.group({
      menuItemIngredientId: ['', [Validators.required]],
      menuItemId: ['', [Validators.required]],
      ingredientId: ['', [Validators.required]],
      quantity: ['', [Validators.required, nonNegativeNumberValidator]],

    });
  }
  ngOnInit(): void {
    this.getIngredients();
    this.getProducts();
    this.setValue();
  }


  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
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

  getIngredientById(id: number): Ingredient | null {
    const found = this.ingredients.find(data => data.ingredientId === id);
    return found || null;
  }

  getProductById(id: number): Product | null {
    const found = this.products.find(data => data.menuItemId === id);
    return found || null;
  }

  setValue() {
    if (this.menuItemIngredient) {
      this.menuItemIngredientForm.patchValue({
        menuItemIngredientId: this.menuItemIngredient.menuItemIngredientId,
        menuItemId: this.menuItemIngredient.menuItemId,
        ingredientId: this.menuItemIngredient.ingredientId,
        quantity: this.menuItemIngredient.quantity,
      });
    }
  }
  updateMenuItemIngredient(): void {
    this.isSubmitted = true;

    if (this.menuItemIngredientForm.valid) {
      const updatedMenuItemIngredient: MenuItemIngredient = {
        menuItemIngredientId: +this.menuItemIngredientForm.get('menuItemIngredientId')?.value,
        menuItemId: +this.menuItemIngredientForm.get('menuItemId')?.value,
        ingredientId: +this.menuItemIngredientForm.get('ingredientId')?.value,
        quantity: +this.menuItemIngredientForm.get('quantity')?.value,
      };

      this.menuItemIngredientService.update(updatedMenuItemIngredient).subscribe(
        () => {
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
          this.activeModal.close('Close after saving');
          this.menuItemIngredientForm.reset();
          //this.menuItemIngredientSaved.emit(); // Emit the event
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

