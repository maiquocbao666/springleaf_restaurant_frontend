import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-product-detail',
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.css']
})
export class AdminProductDetailComponent implements OnInit {
  @Input() product: Product | undefined;
  @Output() productSaved: EventEmitter<void> = new EventEmitter<void>();
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  fieldNames: string[] = [];
  isSubmitted = false;

  categoriesUrl = 'categories';
  productsUrl = 'products';

  @ViewChild('imageUpload') imageUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {
    this.productForm = this.formBuilder.group({
      menuItemId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      unitPrice: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      status: [, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
    this.setValue();
  }

  getCategories(): void {
    this.categoryService.getCache().subscribe(
      (cached: any[]) => {
        this.categories = cached;
      }
    );
  }

  getProducts(): void {
    this.productService.getCache().subscribe(
      (cached: any[]) => {
        this.products = cached;
      }
    );
  }

  setValue() {
    if (this.product) {
      this.productForm.patchValue({
        menuItemId: this.product.menuItemId,
        name: this.product.name,
        unitPrice: this.product.unitPrice,
        description: this.product.description,
        status: this.product.status,
        categoryId: this.product.categoryId,
        imageUrl: this.product.imageUrl
      });
    }
  }
  updateProduct(): void {
    this.isSubmitted = true;
    if (this.productForm.valid) {
      const updatedProduct: Product = {
        menuItemId: +this.productForm.get('menuItemId')?.value,
        name: this.productForm.get('name')?.value,
        unitPrice: +this.productForm.get('unitPrice')?.value,
        description: this.productForm.get('description')?.value,
        status: this.productForm.get('status')?.value,
        categoryId: +this.productForm.get('categoryId')?.value,
        imageUrl: this.productForm.get('imageUrl')?.value,
      };
      this.productService.update(updatedProduct).subscribe(
        () => {
          // Nếu cập nhật thành công, đóng modal ở đây
          this.activeModal.close('Close after saving');
          Swal.fire('Thành công', 'Cập nhật thành công!', 'success');
        },
        (error) => {
          // Nếu có lỗi, chỉ hiển thị thông báo lỗi mà không đóng modal
          Swal.fire('Thất bại', 'Cập nhật thất bại!', 'error');
          console.error('Cập nhật không thành công:', error);
        }
      );
    } else {
      Swal.fire('Lỗi', 'Vui lòng điền đầy đủ thông tin!', 'warning');
    }
  }



  ngAfterViewInit() {
    this.imageUpload.nativeElement.addEventListener('change', (event) => {
      this.readImgUrlAndPreview(event.target!);
    });
  }

  readImgUrlAndPreview(input: EventTarget) {
    const fileInput = input as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.nativeElement.src = e.target.result;
        this.imagePreview.nativeElement.style.opacity = '1';
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
}
