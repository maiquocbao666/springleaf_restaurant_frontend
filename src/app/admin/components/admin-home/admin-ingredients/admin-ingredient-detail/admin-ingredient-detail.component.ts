import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-ingredient-detail',
  templateUrl: './admin-ingredient-detail.component.html',
  styleUrls: ['./admin-ingredient-detail.component.css']
})
export class AdminIngredientDetailComponent implements OnInit {
  @Input() ingredient: Ingredient | undefined;
  @Output() ingredientSaved: EventEmitter<void> = new EventEmitter<void>();

  fieldNames: string[] = [];
  ingredients: Ingredient[] = [];
  ingredientForm: FormGroup;
  isSubmitted = false;


  constructor(
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal) {
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
    this.isSubmitted = true;
    if (this.ingredientForm.valid) {
      const updatedIngredient: Ingredient = {
        ingredientId: +this.ingredientForm.get('ingredientId')?.value,
        name: this.ingredientForm.get('name')?.value,
        description: this.ingredientForm.get('description')?.value,
        orderThreshold: +this.ingredientForm.get('orderThreshold')?.value
      };
  
      this.ingredientService.update(updatedIngredient).subscribe(
        () => {
          // Nếu cập nhật thành công, đóng modal ở đây
          this.activeModal.close('Close after saving');
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
        },
        (error) => {
          // Nếu có lỗi, chỉ hiển thị thông báo lỗi mà không đóng modal
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'warning');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin!', 'error');
    }
  }
  
}
