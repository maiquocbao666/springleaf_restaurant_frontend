import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ingredient } from 'src/app/interfaces/ingredient';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
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
  ingredientsUrl = 'ingredients';

  isSubmitted = false;

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private sweetAlertService: ToastService

  ) {
    this.ingredientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      orderThreshold: new FormControl('', Validators.required)
    });

  }

  ngOnInit(): void {
    this.getIngredients();
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getIngredients(): void {
    this.ingredientService.getCache().subscribe(
      (cached: any[]) => {
        this.ingredients = cached;
      }
    );
  }

  addIngredient(): void {
    this.isSubmitted = true;
    if (this.ingredientForm.valid) {
      const name = this.ingredientForm.get('name')?.value?.trim() ?? '';
      const description = this.ingredientForm.get('description')?.value;
      const orderThreshold = this.ingredientForm.get('orderThreshold')?.value;

      const newIngredient: Ingredient = {
        name: name,
        description: description,
        orderThreshold: orderThreshold
      }
      this.ingredientService.add(newIngredient)
        .subscribe(ingredient => {
          this.ingredientForm.reset();
          this.isSubmitted = false;
          Swal.fire('Thành công', 'Thêm thành công!', 'success');

        });
    } else
      Swal.fire('Thất bại', 'Thêm thất bại!', 'warning');
  }
  deleteIngredient(ingredient: Ingredient): void {
    if (ingredient.ingredientId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa ' + ingredient.name, 'Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.ingredientService.delete(ingredient.ingredientId!)
              .subscribe(() => {
                console.log('Đã xóa thành phần!');
                Swal.fire('Thành công', 'Xóa ' + ingredient.name + ' thành công!', 'success');
                this.isSubmitted = false;


              })
          }
        });
    } else {
      Swal.fire('Thất bại', 'Không thể xóa nguyên liệu với mã không xác định!', 'warning');

    }
  }

  openIngredientDetailModal(ingredient: Ingredient) {
    const modalRef = this.modalService.open(AdminIngredientDetailComponent, { size: 'lg' });
    modalRef.componentInstance.ingredient = ingredient;
    modalRef.componentInstance.ingredientSaved.subscribe(() => {
    });

  }


}
