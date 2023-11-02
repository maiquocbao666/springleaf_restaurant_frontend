import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-product-detail',
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.css']
})
export class AdminProductDetailComponent {
  @Input() product: Product | undefined;
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  fieldNames: string[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    window.addEventListener('storage', (event) => {
      if (event.key && event.oldValue !== null) {
        localStorage.setItem(event.key, event.oldValue);
      }
    });
    this.productForm = this.formBuilder.group({
      menuItemId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
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
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }
  getProducts(): void {
    this.productService.getProducts()
      .subscribe(product => this.products = product);
  }


  setValue() {
    if (this.product) {
      this.productForm.patchValue({
        menuItemId: this.product.menuItemId,
        name: this.product.name,
        price: this.product.price,
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
        menuItemId: this.productForm.get('menuItemId')?.value,
        name: this.productForm.get('name')?.value,
        price: this.productForm.get('price')?.value,
        description: this.productForm.get('description')?.value,
        status: this.productForm.get('status')?.value,
        categoryId: this.productForm.get('categoryId')?.value,
        imageUrl: this.productForm.get('imageUrl')?.value,

      };

      this.productService.updateProduct(updatedProduct).subscribe(() => {
        // Cập nhật cache
        this.productService.updateProductCache(updatedProduct);
      });
    }
  }
}
