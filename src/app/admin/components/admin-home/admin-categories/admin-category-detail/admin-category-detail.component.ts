import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal,
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [, [Validators.nullValidator]],
      name: ['', [Validators.required]],
      active: [false, [Validators.required]], // Giả sử giá trị active ban đầu là false
      description: ['', [Validators.nullValidator]],
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
    this.activeModal.close('Close after saving');
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        categoryId: +this.categoryForm.get('id')?.value,
        name: this.categoryForm.get('name')?.value,
        description: this.categoryForm.get('description')?.value,
        active: this.categoryForm.get('active')?.value,
      };

      this.categoryService.update(updatedCategory).subscribe(() => {
        console.log("Cập nhật cache category");
      });
    }
  }

}