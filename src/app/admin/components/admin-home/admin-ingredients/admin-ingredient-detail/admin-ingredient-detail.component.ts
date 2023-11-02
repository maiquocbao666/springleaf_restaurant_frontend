import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';

@Component({
  selector: 'app-admin-ingredient-detail',
  templateUrl: './admin-ingredient-detail.component.html',
  styleUrls: ['./admin-ingredient-detail.component.css']
})
export class AdminIngredientDetailComponent {
  @Input() ingredient: Ingredient | undefined;
  fieldNames: string[] = [];
  ingredients: Ingredient[] = [];
  ingredientForm: FormGroup;

  constructor(
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.ingredientForm = this.formBuilder.group({
      ingredientId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      orderThreshold: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.setValue();
  }
  setValue() {
    if (this.ingredient) {
      this.ingredientForm.patchValue({
        ingredientId: this.ingredient.ingredientId,
        name: this.ingredient.name,
        description: this.ingredient.description,
        orderThreshold: this.ingredient.orderThreshold,
      });
    }
  }
  updateIngredient(): void {
    this.activeModal.close('Close after saving');
    if (this.ingredientForm.valid) {
      const updatedIngredient: Ingredient = {
        ingredientId: this.ingredientForm.get('ingredientId')?.value,
        name: this.ingredientForm.get('name')?.value,
        description: this.ingredientForm.get('description')?.value,
        orderThreshold: this.ingredientForm.get('orderThreshold')?.value
      };

      this.ingredientService.updateIngredient(updatedIngredient).subscribe(() => {
        // Cập nhật cache
        this.ingredientService.updateIngredientCache(updatedIngredient);
      });
    }
  }
}
