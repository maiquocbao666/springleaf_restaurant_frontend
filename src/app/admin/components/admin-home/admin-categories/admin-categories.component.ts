import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { AdminCategoryDetailComponent } from './admin-category-detail/admin-category-detail.component';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent {

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [5, 10, 15, 20];

  category!: Category | null;
  categories: Category[] = [];
  categoryForm: FormGroup;

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      active: [, [Validators.required]],
      description: [, [Validators.nullValidator]],
    });
  }

  ngOnInit(): void {
    console.log("Init admin category component");
    this.getCategories();
    this.categoryForm.get('active')?.setValue(true);
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCategories();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCategories();
  }

  addCategory(): void {
    const name = this.categoryForm.get('name')?.value?.trim() ?? '';
    const active = this.categoryForm.get('active')?.value;
    const description = this.categoryForm.get('description')?.value;

    if (!name || active === null) {
      return;
    }

    // Tạo một đối tượng Inventory và gán giá trị
    const newCategory: Category = {
      name: name,
      active: active,
      description: description,
    };

    this.categoryService.addCategory(newCategory)
      .subscribe(() => {
        this.getCategories();
        this.categoryForm.reset();
        this.categoryForm.get('active')?.setValue(true);
      });
  }

  deleteCategory(category: Category): void {
    if (category.categoryId) {
      this.categories = this.categories.filter(c => c !== category);
      this.categoryService.deleteCategory(category.categoryId).subscribe();
    } else {
      console.error("Cannot delete category with undefined categoryId.");
    }
  }

  getCategoryById(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.categoryService.getCategoryById(id).subscribe(category => {
      this.category = category;
      if (category) {
        this.categoryForm.get('name')?.setValue(category.name);
      }
    });
  }

  openCategoryDetailModal(category: Category) {
    const modalRef = this.modalService.open(AdminCategoryDetailComponent, { size: 'lg' });
    modalRef.componentInstance.category = category;

    // Subscribe to the emitted event
    modalRef.componentInstance.categorySaved.subscribe(() => {
      this.getCategories(); // Refresh data in the parent component
    });

  }

}
