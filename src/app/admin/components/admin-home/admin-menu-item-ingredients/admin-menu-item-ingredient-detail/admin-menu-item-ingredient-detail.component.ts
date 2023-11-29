import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { MenuItemIngredient } from 'src/app/interfaces/menu-item-ingredient';
import { Product } from 'src/app/interfaces/product';
import { IngredientService } from 'src/app/services/ingredient.service';
import { MenuItemIngredientService } from 'src/app/services/menu-Item-ingredient.service';
import { ProductService } from 'src/app/services/product.service';

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
      quantity: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    this.getIngredients();
    this.getProducts();
    this.setValue();
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
    this.activeModal.close('Close after saving');
    if (this.menuItemIngredientForm.valid) {
      const updatedMenuItemIngredient: MenuItemIngredient = {
        menuItemIngredientId: +this.menuItemIngredientForm.get('menuItemIngredientId')?.value,
        menuItemId: +this.menuItemIngredientForm.get('menuItemId')?.value,
        ingredientId: +this.menuItemIngredientForm.get('ingredientId')?.value,
        quantity: +this.menuItemIngredientForm.get('quantity')?.value,
      };

      this.menuItemIngredientService.update(updatedMenuItemIngredient).subscribe(() => {
        //this.menuItemIngredientSaved.emit(); // Emit the event
      });
    }
  }
}

