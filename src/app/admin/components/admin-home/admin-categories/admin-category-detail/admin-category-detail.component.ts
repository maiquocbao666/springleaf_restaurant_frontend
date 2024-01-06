import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-category-detail',
  templateUrl: './admin-category-detail.component.html',
  styleUrls: ['./admin-category-detail.component.css']
})
export class AdminCategoryDetailComponent implements OnInit {

  @Input() category: Category | undefined;
  @Output() categorySaved: EventEmitter<void> = new EventEmitter<void>();
  categoryForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal,
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [, [Validators.nullValidator]],
      name: ['', [Validators.required]],
      active: [false, [Validators.required]], // Giả sử giá trị active ban đầu là false
      description: [''],
    });
  }

  ngOnInit(): void {
    this.setValue();
  }

  setValue() {
    if (this.category) {
      this.categoryForm.patchValue({
        id: this.category.categoryId,
        name: this.category.name,
        active: this.category.active,
        description: this.category.description
      });
    }
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        categoryId: +this.categoryForm.get('id')?.value,
        name: this.categoryForm.get('name')?.value,
        description: this.categoryForm.get('description')?.value,
        active: this.categoryForm.get('active')?.value,
      };

      this.categoryService.update(updatedCategory).subscribe(
        () => {
          // Nếu cập nhật thành công, đóng modal ở đây
          this.activeModal.close('Close after saving');
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
        },
        (error) => {
          // Nếu có lỗi, chỉ hiển thị thông báo lỗi mà không đóng modal
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'error');
        }
      );
    } else Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin!', 'warning');
  }


}