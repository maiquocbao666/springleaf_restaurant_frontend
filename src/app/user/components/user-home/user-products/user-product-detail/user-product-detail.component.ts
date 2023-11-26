import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
declare var $: any;
@Component({
  selector: 'app-user-product-detail',
  templateUrl: './user-product-detail.component.html',
  styleUrls: ['./user-product-detail.component.css']
})
export class UserProductDetailComponent {
  @Input() product: Product | undefined;
  @Output() productSaved: EventEmitter<void> = new EventEmitter<void>();
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  fieldNames: string[] = [];

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
    this.categoryService.gets()
      .subscribe(categories => this.categories = categories);
  }
  getProducts(): void {
    this.productService.gets()
      .subscribe(product => this.products = product);
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getCategoryById(categoryId: number): Observable<Category | null> {
    return this.categoryService.getById(categoryId);
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
}
