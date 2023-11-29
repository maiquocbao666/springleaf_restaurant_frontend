import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

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

  categoriesUrl = 'categories';
  productsUrl = 'products';


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
    this.activeModal.close('Close after saving');
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

      this.productService.update(updatedProduct).subscribe(() => {

      });
    }
  }
}
