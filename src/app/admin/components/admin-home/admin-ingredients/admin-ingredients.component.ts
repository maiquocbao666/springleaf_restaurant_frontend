import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';
import { AdminIngredientDetailComponent } from './admin-ingredient-detail/admin-ingredient-detail.component';

@Component({
  selector: 'app-admin-ingredient',
  templateUrl: './admin-ingredients.component.html',
  styleUrls: ['./admin-ingredients.component.css']
})
export class AdminIngredientsComponent {
  ingredients: Ingredient[] = [];
  ingredientForm: FormGroup;
  ingredient: Ingredient | undefined;
  fieldNames: string[] = [];

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private ingredientService: IngredientService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.ingredientForm = this.formBuilder.group({
      // ingredientId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      orderThreshold: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getIngredients();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getIngredients();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getIngredients();
  }

  getIngredients(): void {
    this.ingredientService.getIngredients()
      .subscribe(ingredients => this.ingredients = ingredients);
  }
  addIngredient(): void {

    const name = this.ingredientForm.get('name')?.value?.trim() ?? '';
    const description = this.ingredientForm.get('description')?.value;
    const orderThreshold = this.ingredientForm.get('orderThreshold')?.value;
    this.ingredientService.addIngredient({ name, orderThreshold, description } as Ingredient)
      .subscribe(ingredient => {
        this.ingredients.push(ingredient);
        this.ingredientForm.reset();
      });
  }

  deleteIngredient(ingredient: Ingredient): void {
    this.ingredients = this.ingredients.filter(i => i !== ingredient);
    this.ingredientService.deleteIngredient(ingredient.ingredientId).subscribe();
  }

  openIngredientDetailModal(ingredient: Ingredient) {
    const modalRef = this.modalService.open(AdminIngredientDetailComponent, { size: 'lg' });
    modalRef.componentInstance.ingredient = ingredient;

  }
}
