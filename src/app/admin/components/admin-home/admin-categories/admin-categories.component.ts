import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';
import { AdminCategoryDetailComponent } from './admin-category-detail/admin-category-detail.component';
import { HttpClient } from '@angular/common/http';
import { NgForOf } from '@angular/common';

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
  isSubmitted = false;
  category!: Category | null;
  categories: Category[] = [];
  categoryForm: FormGroup;
  ascendingOrder = true; // Initial order

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private sweetAlertService: ToastService,
    private http: HttpClient,

  ) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      active: new FormControl('', Validators.required),
      description: new FormControl('', Validators.nullValidator)
    });

  }

  ngOnInit(): void {
    //console.log("Init admin category component");
    this.getCategories();
    this.categoryForm.get('active')?.setValue(true);
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  addCategory(): void {
    this.isSubmitted = true;
    if (this.categoryForm.valid) {
      const name = this.categoryForm.get('name')?.value?.trim() ?? '';
      const active = this.categoryForm.get('active')?.value;
      const description = this.categoryForm.get('description')?.value;
      const newCategory: Category = {
        name: name,
        active: active,
        description: description,
      };

      this.categoryService.add(newCategory)
        .subscribe(() => {
          this.categoryForm.reset();
          this.categoryForm.get('active')?.setValue(true);
          Swal.fire('Thành công', 'Thêm thành công!', 'success');
          this.isSubmitted = false;


        });
    } else
      Swal.fire('Thất bại', 'Thêm thất bại!', 'warning');
  }

  deleteCategory(category: Category): void {
    if (category.categoryId) {
      this.sweetAlertService.showConfirmAlert('Bạn có muốn xóa ' + category.name, ' Không thể lưu lại!', 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.categoryService.delete(category.categoryId!)
              .subscribe(() => {
                console.log('Đã xóa danh mục!');
                Swal.fire('Thành công', 'Xóa ' + category.name + ' thành công!', 'success');
                // Thực hiện các hành động bổ sung sau khi xóa nếu cần
              })

          }
        });
    } else {
      Swal.fire('Thất bại', 'Không thể xóa danh mục với categoryId không xác định!', 'warning');

    }
  }

  openCategoryDetailModal(category: Category) {
    const modalRef = this.modalService.open(AdminCategoryDetailComponent, { size: 'lg' });
    modalRef.componentInstance.category = category;
  }

  search() {
    if (this.keywords.trim() === '') {
      this.getCategories();
    } else {
      this.categoryService.searchByKeywords(this.keywords, this.fieldName).subscribe(
        (data) => {
          this.categories = data;
        }
      );
    }
  }

  fieldName!: keyof Category;
  changeFieldName(event: any) {
    this.fieldName = event.target.value;
    this.search();
  }

  keywords = '';
  changeSearchKeyWords(event: any){
    this.keywords = event.target.value;
    this.search();
  }

  sort(field: keyof Category, ascending: boolean): void {
    this.categoryService
      .sortEntities(this.categories, field, ascending)
      .subscribe(
        (data) => {
          this.categories = data;
        },
        (error) => {
          // Handle error if necessary
        }
      );
  }

  // getCategoryById(): void {
  //   const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
  //   this.categoryService.getCategoryById(id).subscribe(category => {
  //     this.category = category;
  //     if (category) {
  //       this.categoryForm.get('name')?.setValue(category.name);
  //     }
  //   });
  // }

}